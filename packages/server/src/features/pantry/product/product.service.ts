import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import {
  CreateProductDto,
  IProduct,
  ReadProductDto,
  UpdateProductDto,
} from '@biaplanner/shared';
import { Repository } from 'typeorm';
import { ProductCategoryJoinService } from './product-category-join.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @Inject(ProductCategoryJoinService)
    private productCategoryJoinService: ProductCategoryJoinService,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<IProduct> {
    const { productCategoryIds, ...rest } = dto;

    const product = await this.productRepository.save(dto);
    await this.productCategoryJoinService.createProductCategoryJoin(
      product.id,
      productCategoryIds,
    );
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
    const product = await this.readProductById(id);
    const updatedProduct = { ...product, ...dto };
    return this.productRepository.save(updatedProduct);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
