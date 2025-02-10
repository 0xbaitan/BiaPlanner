import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PantryItemEntity } from './pantry-item.entity';
import { Between, In, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import {
  CookingMeasurementType,
  CreatePantryItemDto,
  ICreatePantryItemDto,
  IPantryItem,
  IPantryItemExtended,
} from '@biaplanner/shared';
import { ProductService } from '../product/product.service';
import { ProductCategoryService } from '../product/category/product-category.service';
import { RecipeIngredientService } from '@/features/meal-plan/recipe/recipe-ingredient/recipe-ingredient.service';

@Injectable()
export default class PantryItemService {
  constructor(
    @InjectRepository(PantryItemEntity)
    private pantryItemRepository: Repository<PantryItemEntity>,
    @Inject(RecipeIngredientService)
    private recipeIngredientService: RecipeIngredientService,

    @Inject(ProductService) private productService: ProductService,
  ) {}

  private async populatePantryItemMeasurements(pantryItem: IPantryItem) {
    const product = await this.productService.readProductById(
      String(pantryItem.productId),
    );

    if (!product) {
      throw new Error('Product not found');
    }

    pantryItem.totalMeasurements = {
      magnitude: product.measurement.magnitude * pantryItem.quantity,
      unit: product.measurement.unit,
    };
    pantryItem.consumedMeasurements = {
      magnitude: 0,
      unit: product.measurement.unit,
    };
    pantryItem.availableMeasurements = {
      ...pantryItem.totalMeasurements,
    };
    pantryItem.reservedMeasurements = {
      magnitude: 0,
      unit: product.measurement.unit,
    };

    return pantryItem;
  }
  async createPantryItem(
    dto: ICreatePantryItemDto,
    createdById: string,
  ): Promise<IPantryItem> {
    const pantryItem = this.pantryItemRepository.create({
      ...dto,
      createdById,
    });

    const pantryItemWithMeasurements =
      await this.populatePantryItemMeasurements(pantryItem);

    return await this.pantryItemRepository.save(pantryItemWithMeasurements);
  }

  async findAllPantryItems(createdById: string): Promise<IPantryItem[]> {
    const userScopedPantryItems = await this.pantryItemRepository.find({
      where: { createdById },
      relations: [
        'createdBy',
        'product',
        'product.brand',
        'product.productCategories',
      ],
    });
    return userScopedPantryItems;
  }

  async findIngredientCompatiblePantryItems(
    ingredientId: string,
    measurementType: CookingMeasurementType,
  ): Promise<IPantryItem[]> {
    const ingredient =
      await this.recipeIngredientService.getRecipeIngredient(ingredientId);
    const productCategories = ingredient.productCategories;

    console.log('productCategories', productCategories);
    try {
      const applicablePantryItems = await this.pantryItemRepository.find({
        where: {
          product: {
            productCategories: {
              id: In(productCategories.map((category) => category.id)),
            },
            measurementType,
          },
          isExpired: false,
        },
        relations: ['product', 'product.brand', 'product.productCategories'],
      });

      return applicablePantryItems;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
