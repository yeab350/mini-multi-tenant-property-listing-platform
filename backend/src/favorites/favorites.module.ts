import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteEntity } from './favorite.entity';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TenantsModule } from '../tenants/tenants.module';
import { PropertyEntity } from '../properties/property.entity';

@Module({
  imports: [
    TenantsModule,
    TypeOrmModule.forFeature([FavoriteEntity, PropertyEntity]),
  ],
  providers: [FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
