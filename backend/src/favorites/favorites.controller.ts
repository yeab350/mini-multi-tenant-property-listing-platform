import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';

@Controller('tenants/:tenantSlug/favorites')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class FavoritesController {
  constructor(private readonly favorites: FavoritesService) {}

  @Get()
  async list(
    @Param('tenantSlug') tenantSlug: string,
    @CurrentUser() user: AuthUser,
  ) {
    const propertyIds = await this.favorites.listPropertyIds(
      tenantSlug,
      user.id,
    );
    return { propertyIds };
  }

  @Post(':propertyId/toggle')
  toggle(
    @Param('tenantSlug') tenantSlug: string,
    @Param('propertyId') propertyId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.favorites.toggle(tenantSlug, user.id, propertyId);
  }
}
