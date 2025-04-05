import { ConcretRecipeModule } from './concrete-recipe/concrete-recipe.module';
import { ConcreteIngredientModule } from './concrete-ingredient/concrete-ingredient.module';
import { Module } from '@nestjs/common';
import PantryItemModule from '@/features/pantry/pantry-item/pantry-item.module';
import { PantryItemPortionModule } from './pantry-item-portion/pantry-item-portion.module';
import { RecipeController } from './recipe.controller';
import { RecipeEntity } from './recipe.entity';
import { RecipeIngredientModule } from './recipe-ingredient/recipe-ingredient.module';
import { RecipeService } from './recipe.service';
import { RecipeSuggestionsController } from './suggestions.recipe.controller';
import { RecipeSuggestionsService } from './suggestions.recipe.service';
import { RecipeTagModule } from './recipe-tag/recipe-tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeEntity]),
    RecipeTagModule,
    RecipeIngredientModule,
    ConcreteIngredientModule,
    ConcretRecipeModule,
    PantryItemPortionModule,
    PantryItemModule,
  ],
  controllers: [RecipeController, RecipeSuggestionsController],
  providers: [RecipeService, RecipeSuggestionsService],
})
export class RecipeModule {}
