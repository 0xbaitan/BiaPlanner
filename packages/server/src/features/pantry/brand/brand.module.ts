import { BrandController } from './brand.controller';
import { BrandEntity } from './brand.entity';
import { BrandService } from './brand.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BrandEntity])],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [TypeOrmModule],
})
export default class BrandModule {}
