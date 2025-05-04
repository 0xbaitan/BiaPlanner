import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  SelectQueryBuilder,
  Brackets,
  EntityManager,
} from 'typeorm';

import { PantryItemEntity } from './pantry-item.entity';
import {
  PantryItemSortBy,
  IPantryItem,
  IQueryPantryItemDto,
  Paginated,
  CookingMeasurementType,
  IQueryCompatiblePantryItemDto,
  IPantryItemPortion,
  IPantryItemWithReservationPresent,
} from '@biaplanner/shared';
import paginate from '@/util/paginate';
import { RecipeIngredientService } from '@/features/meal-plan/recipe/recipe-ingredient/recipe-ingredient.service';
import { PantryItemPortionService } from '@/features/meal-plan/recipe/pantry-item-portion/pantry-item-portion.service';
import { PantryItemPortionEntity } from '@/features/meal-plan/recipe/pantry-item-portion/pantry-item-portion.entity';

@Injectable()
export class QueryPantryItemService {
  constructor(
    @InjectRepository(PantryItemEntity)
    private readonly pantryItemRepository: Repository<PantryItemEntity>,
    @Inject(RecipeIngredientService)
    private readonly recipeIngredientService: RecipeIngredientService,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
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
    return paginate<IPantryItem>(qb, page, limit, search);
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

  async findIngredientCompatiblePantryItems(
    dto: IQueryCompatiblePantryItemDto,
  ): Promise<IPantryItemWithReservationPresent[]> {
    const { ingredientId, measurementType, existingConcreteIngredientId } = dto;
    const ingredient =
      await this.recipeIngredientService.getRecipeIngredient(ingredientId);
    const productCategories = ingredient.productCategories;

    console.log('productCategories', productCategories);
    try {
      const qb = this.pantryItemRepository
        .createQueryBuilder('pantryItem')
        .leftJoinAndSelect('pantryItem.product', 'product')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.productCategories', 'productCategories')
        .leftJoinAndSelect('pantryItem.pantryItemPortions', 'pantryItemPortion')
        .where('productCategories.id IN (:...productCategoryIds)', {
          productCategoryIds: productCategories.map((category) => category.id),
        });

      if (measurementType) {
        qb.andWhere('product.measurementType = :measurementType', {
          measurementType,
        });
      }
      qb.andWhere('pantryItem.isExpired = :isExpired', {
        isExpired: false,
      }).andWhere('pantryItem.availableMeasurements IS NOT NULL');

      qb.andWhere(
        'JSON_EXTRACT(pantryItem.availableMeasurements, "$.magnitude") > :magnitude',
        {
          magnitude: 0,
        },
      );

      if (existingConcreteIngredientId) {
        qb.orWhere(
          'pantryItemPortion.concreteIngredientId = :concreteIngredientId',
          {
            concreteIngredientId: existingConcreteIngredientId,
          },
        );
      }

      let applicablePantryItems: IPantryItemWithReservationPresent[] =
        await qb.getMany();

      if (existingConcreteIngredientId) {
        applicablePantryItems = await Promise.all(
          applicablePantryItems.map((item) =>
            this.populateWithReservations(item, existingConcreteIngredientId),
          ),
        );
      }

      return applicablePantryItems;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  private async populateWithReservations(
    pantryItem: IPantryItem,
    concreteIngredientId: string,
  ): Promise<IPantryItemWithReservationPresent> {
    const existingPantryItemPortion = await this.entityManager
      .getRepository(PantryItemPortionEntity)
      .createQueryBuilder('pantryItemPortion')
      .where('pantryItemPortion.concreteIngredientId = :concreteIngredientId', {
        concreteIngredientId,
      })
      .andWhere('pantryItemPortion.pantryItemId = :pantryItemId', {
        pantryItemId: pantryItem.id,
      })
      .getOne();

    if (existingPantryItemPortion) {
      return {
        ...pantryItem,
        reservationPresent: true,
        reservedPortion: {
          magnitude: existingPantryItemPortion.portion.magnitude,
          unit: existingPantryItemPortion.portion.unit,
        },
      };
    }

    return pantryItem;
  }
}
