import { ConcretRecipeModule } from './recipe/concrete-recipe/concrete-recipe.module';
import { ConcreteIngredientModule } from './recipe/concrete-ingredient/concrete-ingredient.module';
import { CuisineModule } from './cuisine/cuisine.module';
import { Module } from '@nestjs/common';
import { PantryItemPortionEntity } from './recipe/pantry-item-portion/pantry-item-portion.entity';
import { RecipeModule } from './recipe/recipe.module';

@Module({
  imports: [
    RecipeModule,
    CuisineModule,
    ConcretRecipeModule,
    ConcreteIngredientModule,
    PantryItemPortionEntity,
  ],
  exports: [],
})
export class MealPlanModule {}
