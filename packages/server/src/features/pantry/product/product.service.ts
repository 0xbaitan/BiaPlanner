import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import {
  CreateProductDto,
  IProduct,
  ReadProductDto,
  UpdateProductDto,
} from '@biaplanner/shared';
import { Repository } from 'typeorm';
import { ProductCategoryService } from './category/product-category.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @Inject(ProductCategoryService)
    private productCategoryService: ProductCategoryService,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<IProduct> {
    const { productCategoryIds, ...rest } = dto;

    const product = await this.productRepository.save(dto);

    const updatedProduct = await this.readProductById(product.id);
    return updatedProduct;
  }

  async readProducts(dto: ReadProductDto): Promise<IProduct[]> {
    return this.productRepository.find({
      where: {},
      relations: ['productCategories', 'pantryItems', 'createdBy'],
    });
  }

  async readProductById(id: number): Promise<IProduct> {
    return this.productRepository.findOneOrFail({
      where: { id },
      relations: ['productCategories', 'pantryItems', 'createdBy'],
    });
  }

  async updateProduct(id: number, dto: UpdateProductDto): Promise<IProduct> {
    console.log(JSON.stringify(dto, null, 2));
    const cleanedDto = plainToInstance(UpdateProductDto, dto, {
      excludeExtraneousValues: true,
    });

    const product = await this.productRepository.save({
      id,
      ...cleanedDto,
    });

    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
