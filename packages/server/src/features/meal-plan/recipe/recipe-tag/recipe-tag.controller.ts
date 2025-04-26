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
import { RecipeTagService } from './recipe-tag.service';
import {
  IWriteRecipeTagDto,
  WriteRecipeTagDtoSchema,
} from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';

const WriteRecipeDtoValidationPipe = new ZodValidationPipe(
  WriteRecipeTagDtoSchema,
);

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recipeTagService.findOne(id);
  }

  @Post()
  async create(@Body(WriteRecipeDtoValidationPipe) dto: IWriteRecipeTagDto) {
    return this.recipeTagService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(WriteRecipeDtoValidationPipe) dto: IWriteRecipeTagDto,
  ) {
    return this.recipeTagService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.recipeTagService.delete(id);
  }
}
