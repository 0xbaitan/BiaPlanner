import { BrandEntity } from './brand.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BrandEntity])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export default class BrandModule {}
