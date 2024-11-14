import { Module } from '@nestjs/common';
import { ProductClassificationController } from './product-classification.controller';
import { ProductClassificationEntity } from './product-classification.entity';
import { ProductClassificationService } from './product-classification.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductClassificationEntity])],
  controllers: [ProductClassificationController],
  providers: [ProductClassificationService],
  exports: [TypeOrmModule],
})
export default class ProductClassificationModule {}
