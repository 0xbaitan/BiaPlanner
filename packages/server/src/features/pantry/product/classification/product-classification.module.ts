import { Module } from '@nestjs/common';
import { ProductClassificationEntity } from './product-classification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductClassificationEntity])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export default class ProductClassificationModule {}
