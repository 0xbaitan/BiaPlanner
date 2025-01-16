import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from '@biaplanner/shared';

@Controller('/brands')
export class BrandController {
  constructor(@Inject(BrandService) private brandService: BrandService) {}

  @Get('/')
  async findAllBrands() {
    return this.brandService.findAllBrands();
  }

  @Get('/:id')
  async findBrandById(@Param('id') id: string) {
    return this.brandService.findBrandById(id);
  }

  @Post('/')
  async createBrand(@Body() dto: CreateBrandDto) {
    return this.brandService.createBrand(dto);
  }

  @Put('/:id')
  async updateBrand(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandService.updateBrand(id, dto);
  }
}
