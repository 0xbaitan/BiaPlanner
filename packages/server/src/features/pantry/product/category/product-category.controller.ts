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
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from '@biaplanner/shared';

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
    @Body() dto: UpdateProductCategoryDto,
  ) {
    return this.productCategoriesService.updateProductCategory(id, dto);
  }

  @Delete('/:id')
  async deleteProductCategory(@Param('id') id: string) {
    return this.productCategoriesService.deleteProductCategory(id);
  }

  @Post()
  async createProductCategory(@Body() dto: CreateProductCategoryDto) {
    return this.productCategoriesService.createProductCategory(dto);
  }
}
