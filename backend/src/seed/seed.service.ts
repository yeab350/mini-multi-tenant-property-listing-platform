import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantsService } from '../tenants/tenants.service';
import { UsersService } from '../users/users.service';
import { PropertyEntity } from '../properties/property.entity';
import type { Role } from '../common/types/role';
import { TenantEntity } from '../tenants/tenant.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly tenants: TenantsService,
    private readonly users: UsersService,
    @InjectRepository(TenantEntity)
    private readonly tenantRepo: Repository<TenantEntity>,
    @InjectRepository(PropertyEntity)
    private readonly properties: Repository<PropertyEntity>,
  ) {}

  async onModuleInit() {
    const shouldSeed =
      this.config.get<string>('SEED_ON_START', 'true') === 'true';
    if (!shouldSeed) return;

    const count = await this.tenantRepo.count();
    if (count > 0) {
      this.logger.log('Seed skipped (tenants already exist)');
      return;
    }

    this.logger.log('Seeding database (demo tenants/users/properties)…');

    const tenants = await Promise.all([
      this.tenants.ensureTenant({
        slug: 'alpha-homes',
        name: 'Alpha Homes',
        tagline: 'Family-friendly homes and condos',
        accent: '#4F46E5',
      }),
      this.tenants.ensureTenant({
        slug: 'city-rentals',
        name: 'City Rentals',
        tagline: 'Apartments in the heart of downtown',
        accent: '#0EA5E9',
      }),
      this.tenants.ensureTenant({
        slug: 'luxe-estates',
        name: 'Luxe Estates',
        tagline: 'Premium listings with curated photos',
        accent: '#D97706',
      }),
    ]);

    const rounds = Number(this.config.get<string>('BCRYPT_ROUNDS', '10'));
    const passwordHash = await bcrypt.hash(
      this.config.get<string>('SEED_PASSWORD', 'password'),
      rounds,
    );

    const roles: Role[] = ['user', 'owner', 'admin'];

    for (const tenant of tenants) {
      for (const role of roles) {
        await this.users.ensureUser({
          tenantId: tenant.id,
          email: `${role}@demo.com`,
          passwordHash,
          role,
        });
      }

      // demo properties
      const baseImages = [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
      ];

      const existingProps = await this.properties.count({
        where: { tenantId: tenant.id },
      });
      if (existingProps > 0) continue;

      const demos = [
        {
          title: 'Modern 2BR apartment',
          description:
            'Bright and modern 2-bedroom apartment with an open living area, lots of natural light, and a great neighborhood vibe.',
          location: 'Downtown',
          price: 2500,
          status: 'published' as const,
        },
        {
          title: 'Cozy studio with balcony',
          description:
            'A cozy studio perfect for city living. Includes a private balcony and quick access to transit and cafés.',
          location: 'Midtown',
          price: 1400,
          status: 'published' as const,
        },
        {
          title: 'Draft: family home',
          description:
            'Draft listing: spacious family home with multiple bedrooms, a yard, and room for entertaining.',
          location: 'Suburbs',
          price: 3200,
          status: 'draft' as const,
        },
      ];

      await this.properties.save(
        demos.map((d, idx) =>
          this.properties.create({
            tenantId: tenant.id,
            ownerId: null,
            title: d.title,
            description: d.description,
            location: d.location,
            price: d.price,
            status: d.status,
            disabled: false,
            images: baseImages.map((u) => `${u}&sig=${tenant.slug}-${idx}`),
          }),
        ),
      );
    }

    this.logger.log(
      'Seed complete. Login users: user@demo.com / owner@demo.com / admin@demo.com (password: password)',
    );
  }
}
