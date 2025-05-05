import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, In } from 'typeorm';
import { PantryItemEntity } from './pantry-item.entity';
import {
  CookingMeasurementType,
  IConsumePantryItemDto,
  IPantryItem,
  IPantryItemPortion,
  IWritePantryItemDto,
  IWritePantryItemPortionDto,
} from '@biaplanner/shared';
import { ProductService } from '../product/product.service';
import { RecipeIngredientService } from '@/features/meal-plan/recipe/recipe-ingredient/recipe-ingredient.service';
import convertCookingMeasurement, {
  addMeasurements,
  subtractMeasurements,
} from '@biaplanner/shared/build/util/CookingMeasurementConversion';

@Injectable()
export default class PantryItemService {
  constructor(
    @InjectRepository(PantryItemEntity)
    private readonly pantryItemRepository: Repository<PantryItemEntity>,
    @Inject(RecipeIngredientService)
    private readonly recipeIngredientService: RecipeIngredientService,
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  /**
   * Find a pantry item by ID.
   */
  async findPantryItemById(pantryItemId: string): Promise<IPantryItem> {
    return this.pantryItemRepository.findOneOrFail({
      where: { id: pantryItemId },
      relations: { product: true },
    });
  }

  async findPantryItems(userId: string) {
    return this.pantryItemRepository.find({
      where: { createdById: userId },
      relations: { product: true },
    });
  }

  /**
   * Create a pantry item.
   */
  async create(
    dto: IWritePantryItemDto,
    createdById: string,
  ): Promise<IPantryItem> {
    return this.createWithManager(
      this.pantryItemRepository.manager,
      dto,
      createdById,
    );
  }

  async createWithManager(
    manager: EntityManager,
    dto: IWritePantryItemDto,
    createdById: string,
  ): Promise<IPantryItem> {
    return this.createPantryItem(manager, dto, createdById);
  }

  /**
   * Update a pantry item.
   */
  async update(
    pantryItemId: string,
    dto: IWritePantryItemDto,
  ): Promise<IPantryItem> {
    return this.updateWithManager(
      this.pantryItemRepository.manager,
      pantryItemId,
      dto,
    );
  }

  async updateWithManager(
    manager: EntityManager,
    pantryItemId: string,
    dto: IWritePantryItemDto,
  ): Promise<IPantryItem> {
    return this.updatePantryItem(manager, pantryItemId, dto);
  }

  /**
   * Reserve a portion of a pantry item.
   */
  async reservePortion(pantryItemPortion: IPantryItemPortion): Promise<void> {
    return this.reservePortionWithManager(
      this.pantryItemRepository.manager,
      pantryItemPortion,
    );
  }

  async reservePortionWithManager(
    manager: EntityManager,
    pantryItemPortion: IPantryItemPortion,
  ): Promise<void> {
    return this.reservePantryItemPortion(manager, pantryItemPortion);
  }

  /**
   * Release a portion of a pantry item.
   */
  async releasePortion(pantryItemPortion: IPantryItemPortion): Promise<void> {
    return this.releasePortionWithManager(
      this.pantryItemRepository.manager,
      pantryItemPortion,
    );
  }

  async releasePortionWithManager(
    manager: EntityManager,
    pantryItemPortion: IPantryItemPortion,
  ): Promise<void> {
    return this.releasePantryItemPortion(manager, pantryItemPortion);
  }

  /**
   * Adjust a portion of a pantry item.
   */
  async adjustPortion(
    existingPortion: IPantryItemPortion,
    updatedPortion: IWritePantryItemPortionDto,
  ): Promise<IPantryItem> {
    return this.adjustPortionWithManager(
      this.pantryItemRepository.manager,
      existingPortion,
      updatedPortion,
    );
  }

  async adjustPortionWithManager(
    manager: EntityManager,
    existingPortion: IPantryItemPortion,
    updatedPortion: IWritePantryItemPortionDto,
  ): Promise<IPantryItem> {
    return this.adjustPantryItemPortion(
      manager,
      existingPortion,
      updatedPortion,
    );
  }

  /**
   * Consume a portion of a pantry item.
   */
  async consumePortionWithManager(
    manager: EntityManager,
    pantryItemId: string,
    dto: IConsumePantryItemDto,
    useReserved = false,
  ): Promise<IPantryItem> {
    const pantryItem = await manager.findOneOrFail(PantryItemEntity, {
      where: { id: pantryItemId },
      relations: { product: true },
    });

    const measurementUnit = useReserved
      ? pantryItem.reservedMeasurements.unit
      : pantryItem.availableMeasurements.unit;

    const convertedPortion = convertCookingMeasurement(
      dto.measurement,
      measurementUnit,
    );

    if (useReserved) {
      this.validateSufficientQuantity(
        pantryItem.reservedMeasurements.magnitude,
        convertedPortion.magnitude,
        'reserved',
      );
      pantryItem.reservedMeasurements.magnitude -= convertedPortion.magnitude;
    } else {
      this.validateSufficientQuantity(
        pantryItem.availableMeasurements.magnitude,
        convertedPortion.magnitude,
        'available',
      );
      pantryItem.availableMeasurements.magnitude -= convertedPortion.magnitude;
    }

    pantryItem.consumedMeasurements.magnitude += convertedPortion.magnitude;

    return manager.save(PantryItemEntity, pantryItem);
  }

  private validateSufficientQuantity(
    available: number,
    required: number,
    type: string,
  ): void {
    if (available < required) {
      throw new BadRequestException(`Not enough ${type}`);
    }
  }

  async consumePortion(
    pantryItemId: string,
    dto: IConsumePantryItemDto,
  ): Promise<IPantryItem> {
    return this.consumePortionWithManager(
      this.pantryItemRepository.manager,
      pantryItemId,
      dto,
    );
  }

  /**
   * Private helper functions for core logic.
   */

  private async createPantryItem(
    manager: EntityManager,
    dto: IWritePantryItemDto,
    createdById: string,
  ): Promise<IPantryItem> {
    const pantryItem = manager.create(PantryItemEntity, {
      ...dto,
      createdById,
    });
    const pantryItemWithMeasurements =
      await this.populatePantryItemMeasurements(manager, pantryItem);
    return manager.save(PantryItemEntity, pantryItemWithMeasurements);
  }

  private async updatePantryItem(
    manager: EntityManager,
    pantryItemId: string,
    dto: IWritePantryItemDto,
  ): Promise<IPantryItem> {
    const pantryItem = await manager.findOneOrFail(PantryItemEntity, {
      where: { id: pantryItemId },
    });
    Object.assign(pantryItem, dto);
    const pantryItemWithMeasurements =
      await this.populatePantryItemMeasurements(manager, pantryItem);
    return manager.save(PantryItemEntity, pantryItemWithMeasurements);
  }

  private async reservePantryItemPortion(
    manager: EntityManager,
    pantryItemPortion: IPantryItemPortion,
  ): Promise<void> {
    const pantryItem = await manager.findOneOrFail(PantryItemEntity, {
      where: { id: pantryItemPortion.pantryItemId },
    });

    const convertedPortion = convertCookingMeasurement(
      pantryItemPortion.portion,
      pantryItem.availableMeasurements.unit,
    );

    if (
      pantryItem.availableMeasurements.magnitude < convertedPortion.magnitude
    ) {
      throw new BadRequestException('Not enough available');
    }

    pantryItem.availableMeasurements.magnitude -= convertedPortion.magnitude;
    pantryItem.reservedMeasurements.magnitude += convertedPortion.magnitude;

    await manager.save(PantryItemEntity, pantryItem);
  }

  private async releasePantryItemPortion(
    manager: EntityManager,
    pantryItemPortion: IPantryItemPortion,
  ): Promise<void> {
    const pantryItem = await manager.findOneOrFail(PantryItemEntity, {
      where: { id: pantryItemPortion.pantryItemId },
    });

    const portion = convertCookingMeasurement(
      pantryItemPortion.portion,
      pantryItem.availableMeasurements.unit,
    );

    pantryItem.reservedMeasurements.magnitude -= portion.magnitude;
    pantryItem.availableMeasurements.magnitude += portion.magnitude;

    await manager.save(PantryItemEntity, pantryItem);
  }

  private async adjustPantryItemPortion(
    manager: EntityManager,
    existingPortion: IPantryItemPortion,
    updatedPortion: IWritePantryItemPortionDto,
  ): Promise<IPantryItem> {
    const pantryItem = await manager.findOneOrFail(PantryItemEntity, {
      where: { id: existingPortion.pantryItemId },
    });

    await this.releasePantryItemPortion(manager, existingPortion);

    const convertedPortion = convertCookingMeasurement(
      updatedPortion.portion,
      pantryItem.availableMeasurements.unit,
    );

    const netAvailableMeasurement = addMeasurements(
      pantryItem.availableMeasurements,
      existingPortion.portion,
    );
    const netReservedMeasurement = subtractMeasurements(
      pantryItem.reservedMeasurements,
      existingPortion.portion,
    );

    if (netAvailableMeasurement.magnitude < convertedPortion.magnitude) {
      throw new BadRequestException(
        `Not enough available. Available: ${netAvailableMeasurement.magnitude} ${netAvailableMeasurement.unit}. Requested: ${convertedPortion.magnitude} ${convertedPortion.unit}`,
      );
    }

    pantryItem.availableMeasurements.magnitude =
      netAvailableMeasurement.magnitude - convertedPortion.magnitude;
    pantryItem.reservedMeasurements.magnitude =
      netReservedMeasurement.magnitude + convertedPortion.magnitude;

    return manager.save(PantryItemEntity, pantryItem);
  }

  private async populatePantryItemMeasurements(
    manager: EntityManager,
    pantryItem: IPantryItem,
  ): Promise<IPantryItem> {
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
    pantryItem.availableMeasurements = { ...pantryItem.totalMeasurements };
    pantryItem.reservedMeasurements = {
      magnitude: 0,
      unit: product.measurement.unit,
    };

    return pantryItem;
  }
}
