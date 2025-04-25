import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PantryItemEntity } from './pantry-item.entity';
import {
  IQueryPantryItemFilterParams,
  PantryItemSortBy,
  IPantryItem,
} from '@biaplanner/shared';

@Injectable()
export class QueryPantryItemService {
  constructor(
    @InjectRepository(PantryItemEntity)
    private readonly pantryItemRepository: Repository<PantryItemEntity>,
  ) {}

  /**
   * Apply sorting logic based on the `sortBy` parameter.
   */
  private applySorting(
    qb: SelectQueryBuilder<PantryItemEntity>,
    sortBy: PantryItemSortBy,
  ) {
    switch (sortBy) {
      case PantryItemSortBy.PRODUCT_NAME_A_TO_Z:
        qb.addOrderBy('product.name', 'ASC');
        break;
      case PantryItemSortBy.PRODUCT_NAME_Z_TO_A:
        qb.addOrderBy('product.name', 'DESC');
        break;
      case PantryItemSortBy.NEAREST_TO_EXPIRY:
        qb.addOrderBy('pantryItem.expiryDate', 'ASC');
        break;
      case PantryItemSortBy.FURTHEST_FROM_EXPIRY:
        qb.addOrderBy('pantryItem.expiryDate', 'DESC');
        break;
      case PantryItemSortBy.MOST_CONSUMED:
        qb.addOrderBy('pantryItem.consumedMeasurements', 'DESC');
        break;
      case PantryItemSortBy.LEAST_CONSUMED:
        qb.addOrderBy('pantryItem.consumedMeasurements', 'ASC');
        break;
      case PantryItemSortBy.HIGHEST_QUANTITY:
        qb.addOrderBy('pantryItem.quantity', 'DESC');
        break;
      case PantryItemSortBy.LOWEST_QUANTITY:
        qb.addOrderBy('pantryItem.quantity', 'ASC');
        break;
      case PantryItemSortBy.NEWEST:
        qb.addOrderBy('pantryItem.createdAt', 'DESC');
        break;
      case PantryItemSortBy.OLDEST:
        qb.addOrderBy('pantryItem.createdAt', 'ASC');
        break;
      default:
        qb.addOrderBy('pantryItem.createdAt', 'DESC');
        break;
    }
  }

  /**
   * Query pantry items with filters, search, and sorting.
   */
  async query(
    query: IQueryPantryItemFilterParams,
  ): Promise<Pagination<IPantryItem>> {
    const {
      sortBy,
      search,
      isExpired,
      isNonExpirable,
      isLoose,
      brandIds,
      productCategoryIds,
      productIds,
      page,
      limit,
    } = query;

    const qb = this.pantryItemRepository.createQueryBuilder('pantryItem');

    qb.leftJoin('pantryItem.product', 'product')
      .leftJoin('product.brand', 'brand')
      .leftJoin('product.productCategories', 'productCategory');

    // Apply search filter
    if (search && search.trim().length > 0) {
      qb.where(
        new Brackets((qb) => {
          qb.where('LOWER(product.name) LIKE LOWER(:search)', {
            search: `%${search}%`,
          })
            .orWhere('LOWER(product.description) LIKE LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(brand.name) LIKE LOWER(:search)', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(productCategory.name) LIKE LOWER(:search)', {
              search: `%${search}%`,
            });
        }),
      );
    }

    // Apply additional filters
    if (isExpired !== undefined) {
      qb.andWhere('pantryItem.isExpired = :isExpired', { isExpired });
    }

    if (isNonExpirable !== undefined) {
      qb.andWhere('product.canExpire = :canExpire', {
        canExpire: !isNonExpirable,
      });
    }

    if (isLoose !== undefined) {
      qb.andWhere('product.isLoose = :isLoose', { isLoose });
    }

    if (brandIds?.length) {
      qb.andWhere('product.brandId IN (:...brandIds)', { brandIds });
    }

    if (productCategoryIds?.length) {
      qb.andWhere('productCategory.id IN (:...productCategoryIds)', {
        productCategoryIds,
      });
    }

    if (productIds?.length) {
      qb.andWhere('product.id IN (:...productIds)', { productIds });
    }

    // Apply sorting
    this.applySorting(qb, sortBy);

    // Paginate the results
    const results = await paginate(qb, {
      page,
      limit,
      metaTransformer: (meta) => ({
        ...meta,
        search: query.search,
        sortBy: query.sortBy,
        limit: query.limit,
        page: query.page,
      }),
    });

    const hydratedResults = await Promise.all(
      results.items.map(async (item) => {
        const hydratedItem = await this.pantryItemRepository.findOne({
          where: { id: item.id },
          relations: ['product', 'product.brand', 'product.productCategories'],
        });
        return hydratedItem;
      }),
    );

    return new Pagination(hydratedResults, results.meta, results.links);
  }
}
