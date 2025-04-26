import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';
import { paginate, Paginated } from 'nestjs-paginate';
import { ProductEntity } from './product.entity';
import {
  IProduct,
  IQueryProductParamsDto,
  IQueryProductResultsDto,
  IQueryTopBrandedProductsParamsDto,
  QueryProductResultsSchema,
} from '@biaplanner/shared';

@Injectable()
export class QueryProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  /**
   * Apply sorting logic based on the `sortBy` parameter.
   */
  private applySorting(qb: SelectQueryBuilder<ProductEntity>, sortBy: string) {
    switch (sortBy) {
      case 'PRODUCT_NAME_A_TO_Z':
        qb.addOrderBy('product.name', 'ASC');
        break;
      case 'PRODUCT_NAME_Z_TO_A':
        qb.addOrderBy('product.name', 'DESC');
        break;
      case 'PRODUCT_MOST_PANTRY_ITEMS':
        qb.addOrderBy('pantryItemCount', 'DESC');
        break;
      case 'PRODUCT_LEAST_PANTRY_ITEMS':
        qb.addOrderBy('pantryItemCount', 'ASC');
        break;
      case 'PRODUCT_MOST_SHOPPING_ITEMS':
        qb.addOrderBy('shoppingItemCount', 'DESC');
        break;
      case 'PRODUCT_LEAST_SHOPPING_ITEMS':
        qb.addOrderBy('shoppingItemCount', 'ASC');
        break;
      case 'DEFAULT':
      default:
        qb.addOrderBy('product.createdAt', 'DESC');
        break;
    }
  }

  /**
   * Query products with filters, search, and sorting.
   */
  async query(query: IQueryProductParamsDto): Promise<Paginated<IProduct>> {
    console.log('Querying products with query:', query);
    const {
      sortBy = 'DEFAULT',
      search = '',
      page = 1,
      limit = 25,
      isLoose,
      brandIds,
      productCategoryIds,
      isNonExpirable,
    } = query;

    const qb = this.productRepository.createQueryBuilder('product');

    // Join related entities
    qb.leftJoinAndSelect('product.brand', 'brand');
    qb.leftJoinAndSelect('product.pantryItems', 'pantryItem');
    qb.leftJoinAndSelect('product.shoppingItems', 'shoppingItem');
    qb.leftJoinAndSelect('product.productCategories', 'productCategory');
    qb.leftJoinAndSelect('product.cover', 'cover');

    // Apply search filter
    if (search.trim().length > 0) {
      qb.where(
        new Brackets((qb) => {
          qb.where('LOWER(product.name) LIKE LOWER(:search)', {
            search: `%${search}%`,
          }).orWhere('LOWER(product.description) LIKE LOWER(:search)', {
            search: `%${search}%`,
          });
        }),
      );
    }

    // Apply additional filters
    if (brandIds?.length && brandIds.length > 0) {
      qb.andWhere('product.brandId IN (:...brandIds)', { brandIds });
    }

    if (productCategoryIds?.length && productCategoryIds.length > 0) {
      qb.andWhere('productCategory.id IN (:...productCategoryIds)', {
        productCategoryIds,
      });
    }

    // Apply sorting
    this.applySorting(qb, sortBy);

    // Group by product ID to get counts

    // Paginate the results using nestjs-paginate
    const paginatedResults = await paginate<ProductEntity>(
      {
        path: '/query/products',
        page,
        limit,
      },
      qb,
      {
        sortableColumns: ['createdAt'],
        defaultSortBy: [['createdAt', 'DESC']],
        defaultLimit: 25,
        maxLimit: 100,
      },
    );

    return paginatedResults;
  }

  async queryTopBrandedProducts(params: IQueryTopBrandedProductsParamsDto) {
    const { brandId, limit = 10 } = params;
    const qb = this.productRepository.createQueryBuilder('product');
    qb.select([
      'product.id as id',
      'COUNT(DISTINCT pantryItem.id) as distinctPantryItemCount',
      'COUNT(DISTINCT shoppingItem.id) as distinctShoppingItemCount',
    ]);

    qb.leftJoin('product.brand', 'brand')
      .leftJoin('product.pantryItems', 'pantryItem')
      .leftJoin('product.shoppingItems', 'shoppingItem');

    qb.where('brand.id = :brandId', { brandId });

    qb.groupBy('product.id');
    qb.orderBy('distinctShoppingItemCount', 'DESC');
    qb.addOrderBy('distinctPantryItemCount', 'DESC');
    qb.limit(limit);

    const rawResults = await qb.getRawMany<{
      id: string;
      distinctPantryItemCount: number;
      distinctShoppingItemCount: number;
    }>();

    const hydratedResults = await Promise.all(
      rawResults.map((item) => {
        const product = this.productRepository.findOne({
          where: { id: item.id },
          loadEagerRelations: false,
          relations: {
            cover: true,
          },
        });
        return product;
      }),
    );
    return hydratedResults;
  }
}
