import { Module } from '@nestjs/common';
import ProductClassificationModule from './classification/product-classification.module';
import { ProductEntity } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    ProductClassificationModule,
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule, ProductClassificationModule],
})
export default class ProductModule {}
