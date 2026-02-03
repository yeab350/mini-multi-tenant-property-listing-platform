import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantEntity } from './tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantsRepo: Repository<TenantEntity>,
  ) {}

  list() {
    return this.tenantsRepo.find({ order: { createdAt: 'ASC' } });
  }

  findBySlug(slug: string) {
    return this.tenantsRepo.findOne({ where: { slug } });
  }

  async ensureTenant(input: {
    slug: string;
    name: string;
    tagline?: string | null;
    accent?: string | null;
  }) {
    const existing = await this.findBySlug(input.slug);
    if (existing) return existing;

    const entity = this.tenantsRepo.create({
      slug: input.slug,
      name: input.name,
      tagline: input.tagline ?? null,
      accent: input.accent ?? null,
    });

    return this.tenantsRepo.save(entity);
  }
}
