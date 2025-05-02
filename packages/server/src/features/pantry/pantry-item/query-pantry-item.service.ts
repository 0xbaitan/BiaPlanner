import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';

import { PantryItemEntity } from './pantry-item.entity';
import {
  PantryItemSortBy,
  IPantryItem,
  IQueryPantryItemDto,
} from '@biaplanner/shared';
import { paginate, Paginated } from 'nestjs-paginate';

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
  async query(query: IQueryPantryItemDto): Promise<Paginated<IPantryItem>> {
    const {
      sortBy,
      search,
      expiredItemsVisibility,
      showLooseOnly,
      brandIds,
      productCategoryIds,
      productIds,
      page = 1,
      limit = 25,
    } = query;

    const qb = this.pantryItemRepository.createQueryBuilder('pantryItem');

    qb.distinct(true)
      .leftJoinAndSelect('pantryItem.product', 'product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.productCategories', 'productCategory');

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

    // Apply expired items visibility filter
    if (expiredItemsVisibility) {
      if (expiredItemsVisibility === 'SHOW_EXPIRED_ONLY') {
        qb.andWhere('pantryItem.isExpired = true');
      } else if (expiredItemsVisibility === 'SHOW_FRESH_ONLY') {
        qb.andWhere('pantryItem.isExpired = false');
      }
    }

    // Apply loose product filter
    if (showLooseOnly) {
      qb.andWhere('product.isLoose = true');
    }

    // Apply brand filter
    if (brandIds?.length) {
      qb.andWhere('product.brandId IN (:...brandIds)', { brandIds });
    }

    // Apply product category filter
    if (productCategoryIds?.length) {
      qb.andWhere('productCategory.id IN (:...productCategoryIds)', {
        productCategoryIds,
      });
    }

    // Apply product filter
    if (productIds?.length) {
      qb.andWhere('product.id IN (:...productIds)', { productIds });
    }

    // Apply sorting
    this.applySorting(qb, sortBy);

    qb.addGroupBy('pantryItem.id')
      .addGroupBy('product.id')
      .addGroupBy('brand.id')
      .addGroupBy('productCategory.id');

    // Paginate the results
    const results = await paginate<IPantryItem>(
      {
        path: '/query/pantry-items',
        page,
        limit,
      },
      qb,
      {
        sortableColumns: ['createdAt', 'expiryDate', 'quantity'],
        defaultLimit: 25,
      },
    );

    return results;
  }

  /**
   * Find a single pantry item by ID.
   */
  async findOne(id: string): Promise<IPantryItem> {
    return this.pantryItemRepository.findOneOrFail({
      where: { id },
      relations: ['product', 'product.brand', 'product.productCategories'],
    });
  }
}
