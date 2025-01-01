import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';

import {
  IProduct,
  CreateProductDto,
  IUpdateProductDto,
  UpdateProductDto,
} from '@biaplanner/shared';
import { ProductService } from './product.service';

@Controller('/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  async findAllProducts(): Promise<IProduct[]> {
    const products = await this.productService.findAllProducts();
    return products;
  }

  @Get('/:id')
  async getProductById(@Param('id') id: string): Promise<IProduct> {
    const product = await this.productService.readProductById(id);
    return product;
  }

  @Post('/')
  async createProduct(@Body() dto: CreateProductDto): Promise<IProduct> {
    const product = await this.productService.createProduct(dto);
    return product;
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<IProduct> {
    const product = await this.productService.updateProduct(id, dto);
    return product;
  }
}
