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
import { ProductCategoryService } from './product-category.service';
import {
  WriteProductCategoryDtoSchema,
  IWriteProductCategoryDto,
} from '@biaplanner/shared';
import { ZodValidationPipe } from 'nestjs-zod';

const WriteProductCategoryValidationPipe = new ZodValidationPipe(
  WriteProductCategoryDtoSchema,
);

@Controller('/product-categories/')
export class ProductCategoryController {
  constructor(
    @Inject(ProductCategoryService)
    private productCategoriesService: ProductCategoryService,
  ) {}

  @Get('/')
  async findAllProductCategories() {
    return this.productCategoriesService.findAllProductCategories();
  }

  @Get('/:id')
  async findProductCategoryById(@Param('id') id: string) {
    return this.productCategoriesService.findProductCategoryById(id);
  }

  @Put('/:id')
  async updateProductCategory(
    @Param('id') id: string,
    @Body(WriteProductCategoryValidationPipe) dto: IWriteProductCategoryDto,
  ) {
    return this.productCategoriesService.updateProductCategory(id, dto);
  }

  @Delete('/:id')
  async deleteProductCategory(@Param('id') id: string): Promise<void> {
    await this.productCategoriesService.deleteProductCategory(id);
    return;
  }

  @Post()
  async createProductCategory(
    @Body(WriteProductCategoryValidationPipe) dto: IWriteProductCategoryDto,
  ) {
    return this.productCategoriesService.createProductCategory(dto);
  }
}
