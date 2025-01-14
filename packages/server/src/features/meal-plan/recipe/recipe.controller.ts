import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto, ICreateRecipeDto } from '@biaplanner/shared';

@Controller('/meal-plan/recipes')
export class RecipeController {
  constructor(
    @Inject(RecipeService) private readonly recipeService: RecipeService,
  ) {}

  @Get()
  async findAll() {
    return this.recipeService.findAll();
  }

  @Post()
  async createRecipe(@Body() dto: CreateRecipeDto) {
    return this.recipeService.createRecipe(dto);
  }
}
