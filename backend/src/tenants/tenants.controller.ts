import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenants: TenantsService) {}

  @Get()
  list() {
    return this.tenants.list();
  }

  @Get(':tenantSlug')
  async getOne(@Param('tenantSlug') tenantSlug: string) {
    const tenant = await this.tenants.findBySlug(tenantSlug);
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }
}
