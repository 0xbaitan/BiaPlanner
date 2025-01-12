import { CuisineModule } from './cuisine/cuisine.module';
import { Module } from '@nestjs/common';
import { RecipeModule } from './recipe/recipe.module';

@Module({
  imports: [RecipeModule, CuisineModule],
  exports: [],
})
export class MealPlanModule {}
