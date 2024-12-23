import { Inject, Injectable } from '@nestjs/common';
import { ProductsProductCategoriesEntity } from './products-product-categories.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductCategoryJoinService {
  constructor(
    @InjectRepository(ProductsProductCategoriesEntity)
    private productsProductCategoriesRepository: Repository<ProductsProductCategoriesEntity>,
  ) {}

  async createProductCategoryJoin(
    productId: number,
    productCategoryIds: number[],
  ): Promise<void> {
    const productCategoryJoins = productCategoryIds.map((productCategoryId) => {
      const productCategoryJoin = new ProductsProductCategoriesEntity();
      productCategoryJoin.productId = productId;
      productCategoryJoin.productCategoryId = productCategoryId;
      return productCategoryJoin;
    });

    await this.productsProductCategoriesRepository.save(productCategoryJoins);
  }

  async deleteProductCategoryJoin(
    productId: number,
    productCategoryId: number,
  ): Promise<void> {
    await this.productsProductCategoriesRepository.delete({
      productId,
      productCategoryId,
    });
  }

  async deleteProductCategoryJoinsByProductId(
    productId: number,
  ): Promise<void> {
    await this.productsProductCategoriesRepository.delete({ productId });
  }

  async updateProductCategoryJoins(
    productId: number,
    productCategoryIds: number[],
  ): Promise<void> {
    await this.deleteProductCategoryJoinsByProductId(productId);
    await this.createProductCategoryJoin(productId, productCategoryIds);
  }
}
