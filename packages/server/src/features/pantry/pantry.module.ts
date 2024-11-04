import BrandModule from './brand/brand.module';
import { Module } from '@nestjs/common';
import PantryItemModule from './pantry-item/pantry-item.module';
import ProductModule from './product/product.module';

@Module({
  imports: [PantryItemModule, BrandModule, ProductModule],
  controllers: [],
  providers: [],
  exports: [PantryItemModule, BrandModule, ProductModule],
})
export default class PantryModule {}
