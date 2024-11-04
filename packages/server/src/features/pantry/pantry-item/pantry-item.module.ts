import BrandModule from '../brand/brand.module';
import { Module } from '@nestjs/common';
import { PantryItemEntity } from './pantry-item.entity';
import ProductModule from '../product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PantryItemEntity])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export default class PantryItemModule {}
