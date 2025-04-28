import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PantryItemEntity } from './pantry-item.entity';
import { In, Repository } from 'typeorm';
import {
  CookingMeasurementType,
  ICreatePantryItemDto,
  IPantryItem,
  IPantryItemPortion,
  IWritePantryItemDto,
} from '@biaplanner/shared';
import { ProductService } from '../product/product.service';
import { RecipeIngredientService } from '@/features/meal-plan/recipe/recipe-ingredient/recipe-ingredient.service';
import convertCookingMeasurement from '@biaplanner/shared/build/util/CookingMeasurementConversion';

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
      magnitude: product?.measurement.magnitude * pantryItem.quantity,
      unit: product?.measurement.unit,
    };
    pantryItem.consumedMeasurements = {
      magnitude: 0,
      unit: product?.measurement.unit,
    };
    pantryItem.availableMeasurements = {
      ...pantryItem.totalMeasurements,
    };
    pantryItem.reservedMeasurements = {
      magnitude: 0,
      unit: product?.measurement.unit,
    };

    return pantryItem;
  }

  async updatePantryItem(
    pantryItemId: string,
    dto: ICreatePantryItemDto,
  ): Promise<IPantryItem> {
    const pantryItem = await this.pantryItemRepository.findOneOrFail({
      where: { id: pantryItemId },
    });

    if (!pantryItem) {
      throw new Error('Pantry item not found');
    }

    Object.assign(pantryItem, dto);

    const pantryItemWithMeasurements =
      await this.populatePantryItemMeasurements(pantryItem);

    return await this.pantryItemRepository.save(pantryItemWithMeasurements);
  }

  async createPantryItem(
    dto: IWritePantryItemDto,
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

  async findPantryItemsByIds(pantryItemIds: string[]): Promise<IPantryItem[]> {
    return this.pantryItemRepository.find({
      where: { id: In(pantryItemIds) },
      relations: [
        'createdBy',
        'product',
        'product.brand',
        'product.productCategories',
      ],
    });
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
      const applicablePantryItems = await this.pantryItemRepository
        .createQueryBuilder('pantryItem')
        .leftJoinAndSelect('pantryItem.product', 'product')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.productCategories', 'productCategories')
        .where('productCategories.id IN (:...productCategoryIds)', {
          productCategoryIds: productCategories.map((category) => category.id),
        })
        .andWhere('product?.measurementType = :measurementType', {
          measurementType,
        })
        .andWhere('pantryItem.isExpired = :isExpired', { isExpired: false })
        .andWhere('pantryItem.availableMeasurements IS NOT NULL')
        .andWhere(
          'JSON_EXTRACT(pantryItem.availableMeasurements, "$.magnitude") > :magnitude',
          {
            magnitude: 0,
          },
        )
        .getMany();

      console.log('applicablePantryItems', applicablePantryItems);
      return applicablePantryItems;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async reservePortion(pantryItemPortion: IPantryItemPortion) {
    const pantryItem = await this.pantryItemRepository.findOneOrFail({
      where: { id: pantryItemPortion.pantryItemId },
    });

    const convertedPortion = convertCookingMeasurement(
      pantryItemPortion.portion,
      pantryItem.availableMeasurements.unit,
    );

    if (
      pantryItem.availableMeasurements.magnitude < convertedPortion.magnitude
    ) {
      throw new Error('Not enough available');
    }

    pantryItem.availableMeasurements.magnitude -= convertedPortion.magnitude;
    pantryItem.reservedMeasurements.magnitude += convertedPortion.magnitude;

    return this.pantryItemRepository.save(pantryItem);
  }

  async consumePantryItemPortion(pantryItemPortion: IPantryItemPortion) {
    const pantryItem = await this.pantryItemRepository.findOneOrFail({
      where: { id: pantryItemPortion.pantryItemId },
    });

    const convertedPortion = convertCookingMeasurement(
      pantryItemPortion.portion,
      pantryItem.availableMeasurements.unit,
    );

    if (
      pantryItem.reservedMeasurements.magnitude < convertedPortion.magnitude
    ) {
      throw new Error('Not enough reserved');
    }

    pantryItem.reservedMeasurements.magnitude -= convertedPortion.magnitude;
    pantryItem.consumedMeasurements.magnitude += convertedPortion.magnitude;

    return this.pantryItemRepository.save(pantryItem);
  }
}
