import { Module } from '@nestjs/common';
import { RecipeIngredientEntity } from './recipe-ingredient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeIngredientEntity])],
  exports: [],
})
export class RecipeIngredientModule {}
