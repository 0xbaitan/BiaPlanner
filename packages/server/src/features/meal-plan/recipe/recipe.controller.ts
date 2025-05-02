import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { IWriteRecipeDto, transform, WriteRecipeDto } from '@biaplanner/shared';
import ZodValidationPipe, { ZodParsePipe } from '@/util/zod-validation.pipe';
import { FormDataRequest } from 'nestjs-form-data';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileValidationPipe } from '@/util/image-validation.pipe';
const WriteRecipeValidationPipe = new ZodParsePipe(WriteRecipeDto.schema, true);

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
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'tmp/',
    }),
  )
  async createRecipe(
    @Body(WriteRecipeValidationPipe) dto: IWriteRecipeDto,
    @UploadedFile(ImageFileValidationPipe) file: Express.Multer.File,
  ) {
    return this.recipeService.createRecipe(dto, file);
  }

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'tmp/',
    }),
  )
  async updateRecipe(
    @Param('id') id: string,
    @UploadedFile(ImageFileValidationPipe) file: Express.Multer.File,
    @Body(WriteRecipeValidationPipe) dto: IWriteRecipeDto,
  ) {
    return this.recipeService.updateRecipe(id, dto, file);
  }

  @Delete('/:id')
  async deleteRecipe(@Param('id') id: string) {
    return this.recipeService.deleteRecipe(id);
  }
}
