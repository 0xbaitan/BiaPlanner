import { Controller, Get, Inject, Query } from '@nestjs/common';
import { BrandService } from './brand.service';

@Controller('/brands')
export class BrandController {
  constructor(@Inject(BrandService) private brandService: BrandService) {}

  @Get('/')
  async findAllBrands() {
    return this.brandService.findAllBrands();
  }
}
