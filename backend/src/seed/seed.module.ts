import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { TenantsModule } from '../tenants/tenants.module';
import { UsersModule } from '../users/users.module';
import { PropertyEntity } from '../properties/property.entity';
import { TenantEntity } from '../tenants/tenant.entity';

@Module({
  imports: [
    ConfigModule,
    TenantsModule,
    UsersModule,
    TypeOrmModule.forFeature([TenantEntity, PropertyEntity]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
