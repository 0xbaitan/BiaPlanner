import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import {
  CreateProductDto,
  IProduct,
  IProductCategory,
  UpdateProductDto,
} from '@biaplanner/shared';
import { DeepPartial, Repository } from 'typeorm';
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

    const productCategories =
      await this.productCategoryService.findProductCategoriesByIds(
        productCategoryIds,
      );

    const product = this.productRepository.create({
      ...rest,
      productCategories,
    });

    return this.productRepository.save(product);
  }

  async findAllProducts(): Promise<IProduct[]> {
    return this.productRepository.find({
      relations: ['productCategories', 'pantryItems', 'createdBy'],
    });
  }

  async readProductById(id: string): Promise<IProduct> {
    return this.productRepository.findOneOrFail({
      where: { id },
      relations: ['productCategories', 'pantryItems', 'createdBy'],
    });
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<IProduct> {
    const { productCategoryIds, ...rest } = dto;
    const productCategories: IProductCategory[] = productCategoryIds.map(
      (id) => ({ id }) as IProductCategory,
    );
    const product = await this.productRepository.findOneOrFail({
      where: { id },
      relations: ['productCategories', 'pantryItems', 'createdBy'],
    });

    return this.productRepository.save({
      ...product,
      ...rest,
      productCategories,
    });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
