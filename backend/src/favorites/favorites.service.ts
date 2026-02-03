import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteEntity } from './favorite.entity';
import { TenantsService } from '../tenants/tenants.service';
import { PropertyEntity } from '../properties/property.entity';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly tenants: TenantsService,
    @InjectRepository(FavoriteEntity)
    private readonly favorites: Repository<FavoriteEntity>,
    @InjectRepository(PropertyEntity)
    private readonly properties: Repository<PropertyEntity>,
  ) {}

  async listPropertyIds(tenantSlug: string, userId: string) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const rows = await this.favorites.find({
      where: { tenantId: tenant.id, userId },
      order: { createdAt: 'DESC' },
    });

    return rows.map((r) => r.propertyId);
  }

  async toggle(tenantSlug: string, userId: string, propertyId: string) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const property = await this.properties.findOne({
      where: { id: propertyId, tenantId: tenant.id },
    });
    if (!property) throw new NotFoundException('Property not found');

    const existing = await this.favorites.findOne({
      where: { tenantId: tenant.id, userId, propertyId },
    });

    if (existing) {
      await this.favorites.remove(existing);
      return { favorited: false };
    }

    await this.favorites.save(
      this.favorites.create({ tenantId: tenant.id, userId, propertyId }),
    );

    return { favorited: true };
  }
}
