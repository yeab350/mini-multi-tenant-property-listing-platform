import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';

@Controller('tenants/:tenantSlug/admin')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Roles('admin')
  @Get('metrics')
  metrics(@Param('tenantSlug') tenantSlug: string) {
    return this.admin.metrics(tenantSlug);
  }
}
