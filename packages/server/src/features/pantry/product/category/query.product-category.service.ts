import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeepPartial, Repository } from 'typeorm';
import { ProductCategoryEntity } from './product-category.entity';
import { Injectable } from '@nestjs/common';
import {
  FuzzyQuery,
  IProductCategory,
  PaginateQuery,
} from '@biaplanner/shared';
import { FilterOperator, paginate, Paginated } from 'nestjs-paginate';

@Injectable()
export class QueryProductCategoryService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly productCategoryRepository: Repository<ProductCategoryEntity>,
  ) {}

  async queryProductCategories(
    paginatedQuery: PaginateQuery,
    fuzzyQuery?: FuzzyQuery,
  ) {
    const qb = this.productCategoryRepository
      .createQueryBuilder('product_category')
      .select(['product_category.id', 'product_category.name']);

    return paginate<DeepPartial<IProductCategory>>(paginatedQuery, qb, {
      filterableColumns: {
        name: [
          FilterOperator.EQ,
          FilterOperator.ILIKE,
          FilterOperator.CONTAINS,
        ],
      },
      defaultLimit: 25,
      sortableColumns: ['name'],
      defaultSortBy: [['name', 'ASC']],
      searchableColumns: ['name'],
    });
  }

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
}
