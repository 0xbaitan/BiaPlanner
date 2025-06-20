import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { ProductCategoryEntity } from './product-category.entity';
import { Injectable } from '@nestjs/common';
import {
  FuzzyQuery,
  IProductCategory,
  IProductCategoryExtended,
  IQueryProductCategoryDto,
  Paginated,
  ProductCategoryAllergenFilter,
  ProductCategorySortBy,
} from '@biaplanner/shared';
import paginate from '@/util/paginate';
import { ProductEntity } from '../product.entity';

@Injectable()
export class QueryProductCategoryService {
  constructor(
    @InjectRepository(ProductCategoryEntity)
    private readonly productCategoryRepository: Repository<ProductCategoryEntity>,
  ) {}

  /**
   * Query product categories with filters, search, and sorting.
   */
  async query(
    query: IQueryProductCategoryDto,
  ): Promise<Paginated<IProductCategory>> {
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

    qb.addSelect((subQuery) => {
      return subQuery
        .select('COUNT(product.id)', 'productCount')
        .from(ProductEntity, 'product')
        .leftJoin('product.productCategories', 'category')
        .where('category.id = productCategory.id');
    }, 'productCount');

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

    // Paginate the results
    return paginate<IProductCategory, IProductCategoryExtended>(
      qb,
      page,
      limit,
      search,
      (entities, raw) => {
        const extendedProductCategories: IProductCategoryExtended[] =
          entities.map((category, index) => {
            const productCount =
              raw.find((r) => r.productCategory_id === category.id)
                ?.productCount ?? 0;
            return {
              ...category,
              productCount: Number(productCount),
            };
          });

        return extendedProductCategories;
      },
    );
  }

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
