import {
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product, ProductCategory } from '@biaplanner/shared';

import { ProductCategoryEntity } from './category/product-category.entity';
import { ProductEntity } from './product.entity';

@Entity('products_product-categories')
export class ProductsProductCategoriesEntity {
  @PrimaryColumn({ type: 'bigint' })
  productId: number;

  @PrimaryColumn({ type: 'bigint' })
  productCategoryId: number;

  @ManyToOne(() => ProductEntity, (product) => product.productCategories)
  product: Product;

  @ManyToOne(
    () => ProductCategoryEntity,
    (productCategory) => productCategory.products,
  )
  productCategory: ProductCategory;
}
