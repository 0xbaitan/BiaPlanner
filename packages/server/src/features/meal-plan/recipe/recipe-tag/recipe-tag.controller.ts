import { Controller, Get, Inject } from '@nestjs/common';
import { RecipeTagService } from './recipe-tag.service';

@Controller('meal-plan/recipe-tags')
export class RecipeTagController {
  constructor(
    @Inject(RecipeTagService)
    private readonly recipeTagService: RecipeTagService,
  ) {}

  @Get()
  async findAll() {
    return this.recipeTagService.findAll();
  }
}
