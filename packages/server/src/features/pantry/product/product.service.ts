import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import {
  CreateProductDto,
  IProduct,
  ReadProductDto,
  UpdateProductDto,
} from '@biaplanner/shared';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<IProduct> {
    const product = this.productRepository.create(dto);
    return this.productRepository.save(product);
  }

  async readProducts(dto: ReadProductDto): Promise<IProduct[]> {
    return this.productRepository.find({
      where: dto,
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
    const product = await this.readProductById(id);
    const updatedProduct = { ...product, ...dto };
    return this.productRepository.save(updatedProduct);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
