import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ConcreteRecipeService } from './concrete-recipe.service';
import { IConcreteRecipe } from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  IWriteConcreteRecipeDto,
  WriteConcreteRecipeDtoSchema,
} from '@biaplanner/shared';

const WriteConcreteRecipeValidationPipe = new ZodValidationPipe(
  WriteConcreteRecipeDtoSchema,
);

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
  async create(
    @Body(WriteConcreteRecipeValidationPipe)
    dto: IWriteConcreteRecipeDto,
  ): Promise<IConcreteRecipe> {
    return this.concreteRecipeService.create(dto);
  }
}
