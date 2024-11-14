import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ProductClassificationService } from './product-classification.service';
import { ReadProductClassificationDto } from '@biaplanner/shared';

@Controller('/product-classifications/')
export class ProductClassificationController {
  constructor(
    @Inject(ProductClassificationService)
    private productsService: ProductClassificationService,
  ) {}

  @Get('/')
  async getProductClassifications(@Query() dto: ReadProductClassificationDto) {
    return this.productsService.readProductClassifications(dto);
  }
}
