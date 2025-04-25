import { Module } from '@nestjs/common';
import ProductCategoryModule from './category/product-category.module';
import { ProductController } from './product.controller';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { QueryProductController } from './query-product.controller';
import { QueryProductService } from './query-product.service';
import { QueryProductViewEntity } from './query-product.view.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, QueryProductViewEntity]),
    ProductCategoryModule,
  ],
  controllers: [ProductController, QueryProductController],
  providers: [ProductService, QueryProductService],
  exports: [TypeOrmModule, ProductCategoryModule, ProductService],
})
export default class ProductModule {}
