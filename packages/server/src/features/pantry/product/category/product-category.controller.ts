import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ReadProductCategoryDto } from '@biaplanner/shared';

@Controller('/product-categories/')
export class ProductCategoryController {
  constructor(
    @Inject(ProductCategoryService)
    private productCategoriesService: ProductCategoryService,
  ) {}

  @Get('/')
  async getProductCategories(@Query() dto: ReadProductCategoryDto) {
    return this.productCategoriesService.readProductCategory(dto);
  }
}
