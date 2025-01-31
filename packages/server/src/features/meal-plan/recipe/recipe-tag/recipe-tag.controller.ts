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
  CreateRecipeDto,
  CreateRecipeTagDto,
  UpdateRecipeTagDto,
} from '@biaplanner/shared';

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
  async create(@Body() dto: CreateRecipeTagDto) {
    return this.recipeTagService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRecipeTagDto) {
    return this.recipeTagService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.recipeTagService.delete(id);
  }
}
