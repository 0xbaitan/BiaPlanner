import { Module } from '@nestjs/common';
import { RecipeTagEntity } from './recipe-tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeTagEntity])],
  exports: [],
})
export class RecipeTagModule {}
