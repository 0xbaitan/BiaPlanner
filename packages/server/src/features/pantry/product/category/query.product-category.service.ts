import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { ProductCategoryEntity } from './product-category.entity';
import { Injectable } from '@nestjs/common';
import {
  FuzzyQuery,
  IProductCategory,
  IQueryProductCategoryParamsDto,
  IQueryProductCategoryResultsDto,
  Paginated,
  PaginateQuery,
  ProductCategoryAllergenFilter,
  ProductCategorySortBy,
  QueryProductCategoryResultsSchema,
} from '@biaplanner/shared';
import { paginateRaw, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class QueryProductCategoryService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly productCategoryRepository: Repository<ProductCategoryEntity>,
  ) {}

  /**
   * Apply sorting logic based on the `sortBy` parameter.
   */
  private applySorting(
    qb: SelectQueryBuilder<ProductCategoryEntity>,
    sortBy: ProductCategorySortBy,
  ) {
    switch (sortBy) {
      case ProductCategorySortBy.PRODUCT_CATEGORY_NAME_A_TO_Z:
        qb.addOrderBy('productCategory.name', 'ASC');
        break;
      case ProductCategorySortBy.PRODUCT_CATEGORY_NAME_Z_TO_A:
        qb.addOrderBy('productCategory.name', 'DESC');
        break;
      case ProductCategorySortBy.PRODUCT_CATEGORY_MOST_PRODUCTS:
        qb.addOrderBy('productCount', 'DESC');
        break;
      case ProductCategorySortBy.PRODUCT_CATEGORY_LEAST_PRODUCTS:
        qb.addOrderBy('productCount', 'ASC');
        break;
      case ProductCategorySortBy.DEFAULT:
      default:
        qb.addOrderBy('productCategory.createdAt', 'DESC');
        break;
    }
  }

  /**
   * Apply allergen visibility filter.
   */
  private applyAllergenFilter(
    qb: SelectQueryBuilder<ProductCategoryEntity>,
    allergenVisibility: ProductCategoryAllergenFilter,
  ) {
    switch (allergenVisibility) {
      case ProductCategoryAllergenFilter.SHOW_ALLERGENS_ONLY:
        qb.andWhere('productCategory.isAllergen = true');
        break;
      case ProductCategoryAllergenFilter.HIDE_ALLERGENS:
        qb.andWhere('productCategory.isAllergen = false');
        break;
      case ProductCategoryAllergenFilter.SHOW_EVERYTHING:
      default:
        // No filter applied
        break;
    }
  }

  /**
   * Query product categories with filters, search, and sorting.
   */
  async query(
    query: IQueryProductCategoryParamsDto,
  ): Promise<Paginated<IQueryProductCategoryResultsDto>> {
    console.log('Querying product categories with query:', query);
    const {
      sortBy = ProductCategorySortBy.DEFAULT,
      allergenVisibility = ProductCategoryAllergenFilter.SHOW_EVERYTHING,
      search = '',
      page = 1,
      limit = 25,
    } = query;

    const qb =
      this.productCategoryRepository.createQueryBuilder('productCategory');

    qb.select([
      'productCategory.id as id',
      'productCategory.name as name',
      'productCategory.isAllergen as isAllergen',
      'COUNT(product.id) as productCount',
    ]);

    // Join products to count the number of products associated with each category
    qb.leftJoin('productCategory.products', 'product');

    // Apply search filter
    if (search.trim().length > 0) {
      qb.where(
        new Brackets((qb) => {
          qb.where('LOWER(productCategory.name) LIKE LOWER(:search)', {
            search: `%${search}%`,
          });
        }),
      );
    }

    // Apply allergen visibility filter
    this.applyAllergenFilter(qb, allergenVisibility);

    // Apply sorting
    this.applySorting(qb, sortBy);

    // Group by product category ID to get the count of products
    qb.groupBy(
      'productCategory.id, productCategory.name, productCategory.isAllergen',
    );

    // Paginate the results
    const rawResults = await paginateRaw(qb, {
      page,
      limit,
      metaTransformer: (meta) => ({
        ...meta,
        search: query.search,
        sortBy: query.sortBy,
        limit: query.limit,
        allergenVisibility: query.allergenVisibility,
      }),
    });
    console.log(rawResults);

    // Transform raw results using Zod schema
    const transformedResults = rawResults.items.map((item) =>
      QueryProductCategoryResultsSchema.parse(item),
    );

    return new Pagination<IQueryProductCategoryResultsDto>(
      transformedResults,
      rawResults.meta,
      rawResults.links,
    );
  }

  async findAllAllergens() {
    return this.productCategoryRepository.find({
      where: {
        isAllergen: true,
      },
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
