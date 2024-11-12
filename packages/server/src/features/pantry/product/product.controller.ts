import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';

import {
  CreateProductDto,
  IProduct,
  Product,
  UpdateProductDto,
} from '@biaplanner/shared';
import { ProductService } from './product.service';

@Controller('/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  async getAllProducts(): Promise<IProduct[]> {
    const products = await this.productService.readAllProducts();
    return plainToInstance(Product, products);
  }

  @Get('/:id')
  async getProductById(@Param('id') id: number): Promise<IProduct> {
    const product = await this.productService.readProductById(id);
    return plainToInstance(Product, product);
  }

  @Post('/')
  async createProduct(@Body() dto: CreateProductDto): Promise<IProduct> {
    const product = await this.productService.createProduct(dto);
    return plainToInstance(Product, product);
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<IProduct> {
    const product = await this.productService.updateProduct(id, dto);
    return plainToInstance(Product, product);
  }
}
