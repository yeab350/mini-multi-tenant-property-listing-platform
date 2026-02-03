import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsModule } from '../tenants/tenants.module';
import { PropertyEntity } from '../properties/property.entity';
import { UserEntity } from '../users/user.entity';
import { FavoriteEntity } from '../favorites/favorite.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TenantsModule,
    TypeOrmModule.forFeature([PropertyEntity, UserEntity, FavoriteEntity]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
