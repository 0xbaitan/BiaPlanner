import { Module } from '@nestjs/common';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryEntity } from './product-category.entity';
import { ProductCategoryService } from './product-category.service';
import { QueryProductCategoryController } from './query.product-category.controller';
import { QueryProductCategoryService } from './query.product-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategoryEntity])],
  controllers: [ProductCategoryController, QueryProductCategoryController],
  providers: [ProductCategoryService, QueryProductCategoryService],
  exports: [ProductCategoryService],
})
export default class ProductCategoryModule {}
