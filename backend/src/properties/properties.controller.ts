import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { ListPublicPropertiesQueryDto } from './dto/list-public.dto';
import { ListAdminPropertiesQueryDto } from './dto/list-admin.dto';
import { CreateDraftPropertyDto } from './dto/create-draft.dto';
import { PublishPropertyDto } from './dto/publish.dto';
import { UpdateDraftPropertyDto } from './dto/update-draft.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';

@Controller('tenants/:tenantSlug')
export class PropertiesController {
  constructor(private readonly properties: PropertiesService) {}

  @Get('public/properties')
  listPublic(
    @Param('tenantSlug') tenantSlug: string,
    @Query() query: ListPublicPropertiesQueryDto,
  ) {
    return this.properties.listPublic(tenantSlug, {
      location: query.location,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 6,
    });
  }

  @Get('public/properties/stats')
  statsPublic(
    @Param('tenantSlug') tenantSlug: string,
    @Query() query: ListPublicPropertiesQueryDto,
  ) {
    return this.properties.statsPublic(tenantSlug, {
      location: query.location,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    });
  }

  @Get('public/properties/:id')
  getPublicById(
    @Param('tenantSlug') tenantSlug: string,
    @Param('id') id: string,
  ) {
    return this.properties.getPublicById(tenantSlug, id);
  }

  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('owner')
  @Get('owner/properties')
  listOwner(
    @Param('tenantSlug') tenantSlug: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.properties.listOwner(tenantSlug, user.id);
  }

  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/properties')
  listAdmin(@Param('tenantSlug') tenantSlug: string) {
    return this.properties.listAdmin(tenantSlug);
  }

  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/properties/paged')
  listAdminPaged(
    @Param('tenantSlug') tenantSlug: string,
    @Query() query: ListAdminPropertiesQueryDto,
  ) {
    return this.properties.listAdminPaged(tenantSlug, {
      location: query.location,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      status: query.status,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
    });
  }

  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('owner')
  @Post('owner/properties')
  createDraft(
    @Param('tenantSlug') tenantSlug: string,
    @CurrentUser() user: AuthUser,
    @Body() body: CreateDraftPropertyDto,
  ) {
    return this.properties.createDraft(tenantSlug, user.id, body);
  }

  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('owner')
  @Patch('owner/properties/:id')
  updateDraft(
    @Param('tenantSlug') tenantSlug: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() body: UpdateDraftPropertyDto,
  ) {
    return this.properties.updateDraft(tenantSlug, user.id, id, body);
  }

  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('owner')
  @Post('owner/properties/:id/publish')
  publish(
    @Param('tenantSlug') tenantSlug: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() body: PublishPropertyDto,
  ) {
    return this.properties.publish(
      tenantSlug,
      user.id,
      id,
      body.force ?? false,
    );
  }

  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('owner')
  @Post('owner/properties/:id/archive')
  archiveOwner(
    @Param('tenantSlug') tenantSlug: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.properties.archiveOwner(tenantSlug, user.id, id);
  }

  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('owner')
  @Post('owner/properties/:id/delete')
  deleteOwner(
    @Param('tenantSlug') tenantSlug: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.properties.softDeleteOwner(tenantSlug, user.id, id);
  }

  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('user', 'owner', 'admin')
  @Post('public/properties/:id/contact')
  contactOwner(
    @Param('tenantSlug') tenantSlug: string,
    @Param('id') id: string,
  ) {
    return this.properties.contactOwner(tenantSlug, id);
  }

  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/properties/:id/toggle-disabled')
  toggleDisabled(
    @Param('tenantSlug') tenantSlug: string,
    @Param('id') id: string,
  ) {
    return this.properties.toggleDisabled(tenantSlug, id);
  }
}
