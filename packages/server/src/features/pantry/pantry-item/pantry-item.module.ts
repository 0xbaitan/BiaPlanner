import BrandModule from '../brand/brand.module';
import { Module } from '@nestjs/common';
import PantryItemController from './pantry-item.controller';
import { PantryItemEntity } from './pantry-item.entity';
import PantryItemService from './pantry-item.service';
import ProductModule from '../product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PantryItemEntity])],
  controllers: [PantryItemController],
  providers: [PantryItemService],
  exports: [TypeOrmModule],
})
export default class PantryItemModule {}
