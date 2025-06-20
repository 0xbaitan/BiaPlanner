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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IConcreteRecipe> {
    return this.concreteRecipeService.findOne(id);
  }

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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(WriteConcreteRecipeValidationPipe)
    dto: IWriteConcreteRecipeDto,
  ): Promise<IConcreteRecipe> {
    return this.concreteRecipeService.updateWithTransaction(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.concreteRecipeService.deleteWithTransaction(id);
  }

  @Put('/:id/mark-cooked')
  async markAsCooked(@Param('id') id: string): Promise<IConcreteRecipe> {
    return this.concreteRecipeService.markAsCookedWithTransaction(id);
  }
}
