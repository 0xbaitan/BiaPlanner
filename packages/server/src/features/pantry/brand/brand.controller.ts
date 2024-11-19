import { Controller, Get, Inject, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { ReadBrandDto } from '@biaplanner/shared';

@Controller('/brands')
export class BrandController {
  constructor(@Inject(BrandService) private brandService: BrandService) {}

  @Get('/')
  async readBrands(@Query() dto: ReadBrandDto) {
    return this.brandService.readBrands(dto);
  }
}
