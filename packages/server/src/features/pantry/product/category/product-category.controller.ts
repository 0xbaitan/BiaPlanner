import { Controller, Get, Inject } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';

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
}
