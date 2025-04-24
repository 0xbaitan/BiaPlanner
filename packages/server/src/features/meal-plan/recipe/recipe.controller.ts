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

const WriteRecipeValidationPipe = new ZodParsePipe(WriteRecipeDto.schema, true);
const ImageFileValidationPipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: /\/(jpg|jpeg|png|gif|avif)$/,
  })
  .addMaxSizeValidator({
    maxSize: 1024 * 1024, // 1MB
    message: 'File size must be less than 1MB',
  })
  .build({
    fileIsRequired: false, // Allow the file to be optional
  });

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
  @FormDataRequest({
    cleanupAfterSuccessHandle: true,
  })
  async createRecipe(@Body() dto: WriteRecipeDto) {
    return this.recipeService.createRecipe(dto);
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
