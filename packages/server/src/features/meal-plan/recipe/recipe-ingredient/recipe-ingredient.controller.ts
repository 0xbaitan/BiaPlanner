import { Controller, Get, Inject, Query } from '@nestjs/common';
import { RecipeIngredientService } from './recipe-ingredient.service';

@Controller('/meal-plan/recipe-ingredients')
export class RecipeIngredientController {
  constructor(
    @Inject(RecipeIngredientService)
    private readonly recipeIngredientService: RecipeIngredientService,
  ) {}

  @Get('/')
  async findAll(@Query('recipeId') recipeId?: string) {
    if (recipeId) {
      return this.recipeIngredientService.findRecipeIngredients(recipeId);
    } else {
      return this.recipeIngredientService.findAll();
    }
  }
}
