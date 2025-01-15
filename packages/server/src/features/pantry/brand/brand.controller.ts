import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from '@biaplanner/shared';

@Controller('/brands')
export class BrandController {
  constructor(@Inject(BrandService) private brandService: BrandService) {}

  @Get('/')
  async findAllBrands() {
    return this.brandService.findAllBrands();
  }

  @Post('/')
  async createBrand(@Body() dto: CreateBrandDto) {
    return this.brandService.createBrand(dto);
  }
}
