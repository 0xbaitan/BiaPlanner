import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ConcreteRecipeService } from './concrete-recipe.service';
import { CreateConcreteRecipeDto, IConcreteRecipe } from '@biaplanner/shared';

@Controller('/meal-plan/concrete-recipes')
export class ConcreteRecipeController {
  constructor(
    @Inject(ConcreteRecipeService)
    private readonly concreteRecipeService: ConcreteRecipeService,
  ) {}

  @Get()
  async findAll(): Promise<IConcreteRecipe[]> {
    return this.concreteRecipeService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateConcreteRecipeDto): Promise<IConcreteRecipe> {
    return this.concreteRecipeService.create(dto);
  }
}
