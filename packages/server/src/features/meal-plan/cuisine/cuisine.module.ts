import { CuisineEntity } from './cuisine.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CuisineEntity])],
  exports: [],
})
export class CuisineModule {}
