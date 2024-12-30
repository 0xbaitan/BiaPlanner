import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategoryEntity } from './product-category.entity';
import { In, Repository } from 'typeorm';
import {
  CreateProductCategoryDto,
  ReadProductCategoryDto,
  UpdateProductCategoryDto,
} from '@biaplanner/shared';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly productCategoryRepository: Repository<ProductCategoryEntity>,
  ) {}

  async readProductCategory(dto: ReadProductCategoryDto) {
    return this.productCategoryRepository.find({
      where: {},
      relations: ['products'],
    });
  }

  async readProductClassificationById(id: number) {
    return this.productCategoryRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async findProductCategoriesByIds(ids: number[]) {
    const productCategories = await this.productCategoryRepository.find({
      where: {
        id: In(ids),
      },
    });
    return productCategories;
  }

  async createProductClassification(dto: CreateProductCategoryDto) {
    const productClassification = this.productCategoryRepository.create(dto);
    return this.productCategoryRepository.save(productClassification);
  }

  async updateProductClassification(id: number, dto: UpdateProductCategoryDto) {
    const productClassification =
      await this.productCategoryRepository.findOneOrFail({
        where: {
          id,
        },
      });
    return this.productCategoryRepository.save({
      ...productClassification,
      ...dto,
    });
  }

  async deleteProductClassification(id: number) {
    const productClassification =
      await this.productCategoryRepository.findOneOrFail({
        where: {
          id,
        },
      });
    return this.productCategoryRepository.remove(productClassification);
  }
}
