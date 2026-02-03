import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyEntity } from './property.entity';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [TenantsModule, TypeOrmModule.forFeature([PropertyEntity])],
  providers: [PropertiesService],
  controllers: [PropertiesController],
})
export class PropertiesModule {}
