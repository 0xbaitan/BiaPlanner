import { Module } from '@nestjs/common';
import { PantryItemPortionEntity } from './pantry-item-portion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PantryItemPortionEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class PantryItemPortionModule {}
