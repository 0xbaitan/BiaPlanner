import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto, UpdateRecipeDto } from '@biaplanner/shared';

@Controller('/meal-plan/recipes')
export class RecipeController {
  constructor(
    @Inject(RecipeService) private readonly recipeService: RecipeService,
  ) {}

  @Get()
  async findAll() {
    return this.recipeService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.recipeService.findOne(id);
  }

  @Post()
  async createRecipe(@Body() dto: CreateRecipeDto) {
    return this.recipeService.createRecipe(dto);
  }

  @Put('/:id')
  async updateRecipe(@Param('id') id: string, @Body() dto: UpdateRecipeDto) {
    return this.recipeService.updateRecipe(id, dto);
  }

  @Delete('/:id')
  async deleteRecipe(@Param('id') id: string) {
    return this.recipeService.deleteRecipe(id);
  }
}
