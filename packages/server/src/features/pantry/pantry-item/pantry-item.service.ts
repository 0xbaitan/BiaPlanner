import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PantryItemEntity } from './pantry-item.entity';
import { In, Repository } from 'typeorm';
import {
  CookingMeasurementType,
  IConsumePantryItemDto,
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

  async findPantryItemById(pantryItemId: string): Promise<IPantryItem> {
    console.log('findPantryItemById', pantryItemId);
    const pantryItem = await this.pantryItemRepository.findOneOrFail({
      where: { id: pantryItemId },
      relations: {
        product: true,
      },
    });

    return pantryItem;
  }

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
    dto: IWritePantryItemDto,
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

  async consumePantryItemPortion(
    pantryItemPortion: IPantryItemPortion,
    ignoreReserved = false,
  ) {
    const pantryItem = await this.pantryItemRepository.findOneOrFail({
      where: { id: pantryItemPortion.pantryItemId },
    });

    const convertedPortion = convertCookingMeasurement(
      pantryItemPortion.portion,
      pantryItem.availableMeasurements.unit,
    );

    if (
      !ignoreReserved &&
      pantryItem.reservedMeasurements.magnitude < convertedPortion.magnitude
    ) {
      throw new Error('Not enough reserved');
    }

    pantryItem.reservedMeasurements.magnitude -= convertedPortion.magnitude;
    pantryItem.consumedMeasurements.magnitude += convertedPortion.magnitude;

    return this.pantryItemRepository.save(pantryItem);
  }

  async consumePantryItem(dto: IConsumePantryItemDto) {
    const pantryItem = await this.pantryItemRepository.findOneOrFail({
      where: { id: dto.pantryItemId },
    });

    const convertedPortion = convertCookingMeasurement(
      dto.measurement,
      pantryItem.availableMeasurements.unit,
    );

    if (
      pantryItem.availableMeasurements.magnitude < convertedPortion.magnitude
    ) {
      throw new BadRequestException(
        `Not enough available. Available: ${pantryItem.availableMeasurements.magnitude} ${pantryItem.availableMeasurements.unit}. Requested: ${convertedPortion.magnitude} ${convertedPortion.unit}`,
      );
    }

    pantryItem.availableMeasurements.magnitude -= convertedPortion.magnitude;
    pantryItem.consumedMeasurements.magnitude += convertedPortion.magnitude;

    return this.pantryItemRepository.save(pantryItem);
  }
}
