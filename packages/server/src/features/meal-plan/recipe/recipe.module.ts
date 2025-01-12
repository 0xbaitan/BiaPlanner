import { Module } from '@nestjs/common';
import { RecipeEntity } from './recipe.entity';
import { RecipeIngredientModule } from './recipe-ingredient/recipe-ingredient.module';
import { RecipeTagModule } from './recipe-tag/recipe-tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeEntity]),
    RecipeTagModule,
    RecipeIngredientModule,
  ],
})
export class RecipeModule {}
