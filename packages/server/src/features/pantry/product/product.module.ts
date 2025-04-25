import { Module } from '@nestjs/common';
import ProductCategoryModule from './category/product-category.module';
import { ProductController } from './product.controller';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { QueryProductController } from './query-product.controller';
import { QueryProductViewController } from './query-product.view.controller';
import { QueryProductViewEntity } from './query-product.view.entity';
import { QueryProductViewService } from './query-product.view.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, QueryProductViewEntity]),
    ProductCategoryModule,
  ],
  controllers: [
    ProductController,
    QueryProductViewController,
    QueryProductController,
  ],
  providers: [ProductService, QueryProductViewService, QueryProductViewService],
  exports: [TypeOrmModule, ProductCategoryModule, ProductService],
})
export default class ProductModule {}
