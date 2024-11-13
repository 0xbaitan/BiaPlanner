import { Module } from '@nestjs/common';
import ProductClassificationModule from './classification/product-classification.module';
import { ProductController } from './product.controller';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    ProductClassificationModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [TypeOrmModule, ProductClassificationModule],
})
export default class ProductModule {}
