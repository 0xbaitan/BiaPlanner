import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  IProduct,
  IWriteProductDto,
  IQueryProductParamsDto,
  QueryProductParamsSchema,
} from '@biaplanner/shared';
import { ProductService } from './product.service';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/:id')
  async getProductById(@Param('id') id: string): Promise<IProduct> {
    const product = await this.productService.readProductById(id);
    return product;
  }

  @Post('/')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'tmp/',
    }),
  )
  async createProduct(
    @Body() dto: IWriteProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IProduct> {
    const product = await this.productService.createProduct(dto, file);
    return product;
  }

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'tmp/',
    }),
  )
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: IWriteProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IProduct> {
    const product = await this.productService.updateProduct(id, dto, file);
    return product;
  }
}
