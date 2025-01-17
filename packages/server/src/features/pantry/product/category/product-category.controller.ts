import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from '@biaplanner/shared';

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

  @Post()
  async createProductCategory(@Body() dto: CreateProductCategoryDto) {
    return this.productCategoriesService.createProductCategory(dto);
  }
}
