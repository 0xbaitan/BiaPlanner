import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
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
      dest: 'uploads/images',
    }),
  )
  async updateRecipe(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body(WriteRecipeValidationPipe) dto: IWriteRecipeDto,
  ) {
    console.log('updateRecipe', dto);
    return;
    return this.recipeService.updateRecipe(id, dto);
  }

  @Delete('/:id')
  async deleteRecipe(@Param('id') id: string) {
    return this.recipeService.deleteRecipe(id);
  }
}
