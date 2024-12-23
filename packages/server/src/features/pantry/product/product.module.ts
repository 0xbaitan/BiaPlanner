import { Module } from '@nestjs/common';
import { ProductCategoryJoinService } from './product-category-join.service';
import ProductCategoryModule from './category/product-category.module';
import { ProductController } from './product.controller';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { ProductsProductCategoriesEntity } from './products-product-categories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductsProductCategoriesEntity]),
    ProductCategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductCategoryJoinService],
  exports: [TypeOrmModule, ProductCategoryModule],
})
export default class ProductModule {}
