import {
  CookingMeasurement,
  CookingMeasurementType,
  IProductCategory,
  IQueryProductView,
} from '@biaplanner/shared';
import { DataSource, ViewColumn, ViewEntity } from 'typeorm';

import { BrandEntity } from '../brand/brand.entity';
import { ProductCategoryEntity } from './category/product-category.entity';
import { ProductEntity } from './product.entity';

@ViewEntity({
  name: 'query_product_view',
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('product.id', 'id')
      .addSelect('product.name', 'name')
      .addSelect('product.description', 'description')
      .addSelect('product.brandId', 'brandId')
      .addSelect('product.measurement', 'measurement')
      .addSelect('product.measurementType', 'measurementType')
      .addSelect('brand.name', 'brandName')
      .from(ProductEntity, 'product')
      .leftJoin(BrandEntity, 'brand', 'product.brandId = brand.id')
      .leftJoinAndSelect(ProductCategoryEntity, 'productCategories'),
})
export class QueryProductViewEntity implements IQueryProductView {
  @ViewColumn()
  brandName?: string;

  @ViewColumn()
  id: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  description?: string;

  @ViewColumn()
  brandId?: string;

  @ViewColumn()
  measurement: CookingMeasurement;

  @ViewColumn()
  measurementType?: CookingMeasurementType;

  @ViewColumn()
  productCategories?: IProductCategory[];
}
