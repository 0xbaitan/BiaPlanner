import { BrandController } from './brand.controller';
import { BrandEntity } from './brand.entity';
import { BrandService } from './brand.service';
import { Module } from '@nestjs/common';
import { QueryBrandController } from './query-brand.controller';
import { QueryBrandService } from './query-brand.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BrandEntity])],
  controllers: [BrandController, QueryBrandController],
  providers: [BrandService, QueryBrandService],
  exports: [TypeOrmModule],
})
export default class BrandModule {}
