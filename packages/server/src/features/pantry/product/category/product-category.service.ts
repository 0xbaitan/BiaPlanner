import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategoryEntity } from './product-category.entity';
import { In, Repository } from 'typeorm';
import {
  CreateProductCategoryDto,
  ICreateProductCategoryDto,
  IUpdateProductCategoryDto,
  UpdateProductCategoryDto,
} from '@biaplanner/shared';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly productCategoryRepository: Repository<ProductCategoryEntity>,
  ) {}

  async findAllProductCategories() {
    return this.productCategoryRepository.find({
      relations: ['products'],
    });
  }

  async findProductCategoryById(id: string) {
    return this.productCategoryRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['products'],
    });
  }

  async createProductCategory(dto: ICreateProductCategoryDto) {
    const productCategory = this.productCategoryRepository.create(dto);
    return this.productCategoryRepository.save(productCategory);
  }

  async updateProductCategory(id: string, dto: IUpdateProductCategoryDto) {
    const productCategory = await this.findProductCategoryById(id);
    const updatedProductCategory = this.productCategoryRepository.merge(
      productCategory,
      dto,
    );
    return this.productCategoryRepository.save(updatedProductCategory);
  }

  async deleteProductCategory(id: string) {
    const productCategory = await this.findProductCategoryById(id);
    return this.productCategoryRepository.softDelete({
      id: productCategory.id,
    });
  }

  async readProductClassificationById(id: string) {
    return this.productCategoryRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async findProductCategoriesByIds(ids: string[]) {
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

  async updateProductClassification(id: string, dto: UpdateProductCategoryDto) {
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

  async deleteProductClassification(id: string) {
    const productClassification =
      await this.productCategoryRepository.findOneOrFail({
        where: {
          id,
        },
      });
    return this.productCategoryRepository.remove(productClassification);
  }
}
