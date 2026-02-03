import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantsService } from '../tenants/tenants.service';
import { PropertyEntity } from '../properties/property.entity';
import { UserEntity } from '../users/user.entity';
import { FavoriteEntity } from '../favorites/favorite.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly tenants: TenantsService,
    @InjectRepository(PropertyEntity)
    private readonly properties: Repository<PropertyEntity>,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    @InjectRepository(FavoriteEntity)
    private readonly favorites: Repository<FavoriteEntity>,
  ) {}

  async metrics(tenantSlug: string) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    if (!tenant) throw new NotFoundException('Tenant not found');

    const [
      totalProperties,
      totalDeletedProperties,
      draftProperties,
      publishedProperties,
      archivedProperties,
      disabledProperties,
      totalUsers,
      totalFavorites,
    ] = await Promise.all([
      this.properties.count({ where: { tenantId: tenant.id } }),
      this.properties.count({
        where: { tenantId: tenant.id },
        withDeleted: true,
      }),
      this.properties.count({
        where: { tenantId: tenant.id, status: 'draft' },
      }),
      this.properties.count({
        where: { tenantId: tenant.id, status: 'published' },
      }),
      this.properties.count({
        where: { tenantId: tenant.id, status: 'archived' },
      }),
      this.properties.count({ where: { tenantId: tenant.id, disabled: true } }),
      this.users.count({ where: { tenantId: tenant.id } }),
      this.favorites.count({ where: { tenantId: tenant.id } }),
    ]);

    return {
      tenant: { id: tenant.id, slug: tenant.slug, name: tenant.name },
      properties: {
        total: totalProperties,
        deleted: Math.max(0, totalDeletedProperties - totalProperties),
        draft: draftProperties,
        published: publishedProperties,
        archived: archivedProperties,
        disabled: disabledProperties,
      },
      users: {
        total: totalUsers,
      },
      favorites: {
        total: totalFavorites,
      },
    };
  }
}
