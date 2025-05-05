import {
  IWriteConcreteIngredientDto,
  IConcreteIngredient,
  IWritePantryItemPortionDto,
} from '@biaplanner/shared';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { PantryItemPortionService } from '../pantry-item-portion/pantry-item-portion.service';
import { ConcreteIngredientEntity } from './concrete-ingredient.entity';
import convertCookingMeasurement from '@biaplanner/shared/build/util/CookingMeasurementConversion';

@Injectable()
export class ConcreteIngredientService {
  constructor(
    @InjectRepository(ConcreteIngredientEntity)
    private readonly concreteIngredientRepository: Repository<ConcreteIngredientEntity>,
    private readonly pantryItemPortionService: PantryItemPortionService,
  ) {}

  /**
   * Create a concrete ingredient and its associated pantry item portions.
   */
  async create(dto: IWriteConcreteIngredientDto): Promise<IConcreteIngredient> {
    return this.createWithManager(
      this.concreteIngredientRepository.manager,
      dto,
    );
  }

  /**
   * Create a concrete ingredient and its associated pantry item portions using an EntityManager.
   */
  async createWithManager(
    manager: EntityManager,
    dto: IWriteConcreteIngredientDto,
  ): Promise<IConcreteIngredient> {
    return this.createConcreteIngredient(manager, dto);
  }

  /**
   * Manage portions for a concrete ingredient.
   */
  async managePortions(
    id: string,
    portions: IWritePantryItemPortionDto[] = [],
  ): Promise<IConcreteIngredient> {
    return this.managePortionsWithManager(
      this.concreteIngredientRepository.manager,
      id,
      portions,
    );
  }

  /**
   * Manage portions for a concrete ingredient using an EntityManager.
   */
  async managePortionsWithManager(
    manager: EntityManager,
    id: string,
    portions: IWritePantryItemPortionDto[] = [],
  ): Promise<IConcreteIngredient> {
    return this.manageConcreteIngredientPortions(manager, id, portions);
  }

  /**
   * Helper function to create a concrete ingredient.
   */
  private async createConcreteIngredient(
    manager: EntityManager,
    dto: IWriteConcreteIngredientDto,
  ): Promise<IConcreteIngredient> {
    try {
      const { pantryItemsWithPortions, ...ingredientDto } = dto;

      // Create the concrete ingredient
      const concreteIngredient = manager.create(
        ConcreteIngredientEntity,
        ingredientDto,
      );
      const insertResult = await manager.insert(
        ConcreteIngredientEntity,
        concreteIngredient,
      );

      if (!insertResult.identifiers.length) {
        throw new BadRequestException('Failed to create concrete ingredient');
      }

      // Set the ID of the created concrete ingredient
      const createdConcreteIngredientId = insertResult.identifiers[0].id;

      // Map pantry items with portions to include the created concrete ingredient ID
      const pantryItemsWithPortionsMapped = pantryItemsWithPortions.map(
        (item) => ({
          ...item,
          concreteIngredientId: createdConcreteIngredientId,
        }),
      );

      // Create pantry item portions using the manager
      await Promise.all(
        pantryItemsWithPortionsMapped.map((portion) =>
          this.pantryItemPortionService.createWithManager(manager, portion),
        ),
      );

      // Return the created concrete ingredient with relations
      return manager.findOneOrFail(ConcreteIngredientEntity, {
        where: { id: createdConcreteIngredientId },
        relations: ['pantryItemsWithPortions'],
      });
    } catch (error) {
      console.error('Error creating concrete ingredient:', error);
      throw new BadRequestException('Failed to create concrete ingredient');
    }
  }

  /**
   * Helper function to manage portions for a concrete ingredient.
   */
  private async manageConcreteIngredientPortions(
    manager: EntityManager,
    id: string,
    portions: IWritePantryItemPortionDto[] = [],
  ): Promise<IConcreteIngredient> {
    // Find the concrete ingredient
    const concreteIngredient = await manager.findOne(ConcreteIngredientEntity, {
      where: { id },
      relations: ['pantryItemsWithPortions'],
    });

    if (!concreteIngredient) {
      throw new BadRequestException(
        `Concrete ingredient with id ${id} not found`,
      );
    }

    const existingPortions = concreteIngredient.pantryItemsWithPortions;

    // Determine portions to update, create, and delete
    const toBeUpdatedPortions = portions.filter((portion) =>
      existingPortions.some(
        (existingPortion) =>
          existingPortion.id === portion.id &&
          existingPortion.pantryItemId === portion.pantryItemId,
      ),
    );

    const toBeCreatedPortions = portions.filter(
      (portion) =>
        !existingPortions.some(
          (existingPortion) =>
            existingPortion.id === portion.id &&
            existingPortion.pantryItemId === portion.pantryItemId,
        ),
    );

    const toBeDeletedPortions = existingPortions.filter(
      (existingPortion) =>
        !portions.some(
          (portion) =>
            existingPortion.id === portion.id &&
            existingPortion.pantryItemId === portion.pantryItemId,
        ),
    );

    try {
      // Update existing portions
      const updatedPortions = await Promise.all(
        toBeUpdatedPortions.map((portion) =>
          this.pantryItemPortionService.updateWithManager(
            manager,
            portion.id,
            portion,
          ),
        ),
      );

      const updatedPortionIds = updatedPortions.map((portion) => portion.id);

      // Create new portions
      const createdPortions = await Promise.all(
        toBeCreatedPortions.map((portion) =>
          this.pantryItemPortionService.createWithManager(manager, portion),
        ),
      );

      const createdPortionIds = createdPortions.map((portion) => portion.id);

      // Delete old portions
      await Promise.all(
        toBeDeletedPortions.map((portion) =>
          this.pantryItemPortionService.deleteWithManager(manager, portion.id),
        ),
      );

      const deletedPortionIds = toBeDeletedPortions.map(
        (portion) => portion.id,
      );

      // Save the updated concrete ingredient
      await manager
        .createQueryBuilder()
        .relation(ConcreteIngredientEntity, 'pantryItemsWithPortions')
        .of(concreteIngredient)
        .addAndRemove(
          [...updatedPortionIds, ...createdPortionIds],
          deletedPortionIds,
        );

      // Return the updated concrete ingredient
      return manager.findOne(ConcreteIngredientEntity, {
        where: { id },
        relations: ['pantryItemsWithPortions'],
      });
    } catch (error) {
      console.error('Error managing portions:', error);
      throw new BadRequestException('Failed to manage portions');
    }
  }

  public async updateWithManager(
    manager: EntityManager,
    id: string,
    dto: IWriteConcreteIngredientDto,
  ): Promise<IConcreteIngredient> {
    const concreteIngredient = await manager.findOne(ConcreteIngredientEntity, {
      where: { id },
      relations: ['pantryItemsWithPortions'],
    });

    if (!concreteIngredient) {
      throw new BadRequestException(
        `Concrete ingredient with id ${id} not found`,
      );
    }

    // Update the concrete ingredient
    const { pantryItemsWithPortions, ...ingredientDto } = dto;

    await this.manageConcreteIngredientPortions(
      manager,
      concreteIngredient.id,
      pantryItemsWithPortions,
    );

    // Save the updated concrete ingredient
    await manager.update(
      ConcreteIngredientEntity,
      concreteIngredient.id,
      ingredientDto,
    );

    return concreteIngredient;
  }

  public async update(
    id: string,
    dto: IWriteConcreteIngredientDto,
  ): Promise<IConcreteIngredient> {
    return this.updateWithManager(
      this.concreteIngredientRepository.manager,
      id,
      dto,
    );
  }

  public async deleteWithManager(
    manager: EntityManager,
    id: string,
  ): Promise<void> {
    const ingredient = await manager.findOne(ConcreteIngredientEntity, {
      where: { id },
      relations: ['pantryItemsWithPortions'],
    });

    if (!ingredient) {
      throw new BadRequestException(
        `Concrete ingredient with id ${id} not found`,
      );
    }

    // Delete pantry item portions
    await Promise.all(
      ingredient.pantryItemsWithPortions.map((portion) =>
        this.pantryItemPortionService.deleteWithManager(manager, portion.id),
      ),
    );

    // Delete the concrete ingredient
    await manager.delete(ConcreteIngredientEntity, id);
  }

  public async checkFulfillmenWithManager(
    manager: EntityManager,
    id: string,
  ): Promise<boolean> {
    const concreteIngredient = await manager.findOne(ConcreteIngredientEntity, {
      where: { id },
      relations: ['pantryItemsWithPortions', 'ingredient'],
    });

    if (!concreteIngredient) {
      throw new BadRequestException(
        `Concrete ingredient with id ${id} not found`,
      );
    }

    if (
      !concreteIngredient.pantryItemsWithPortions ||
      concreteIngredient.pantryItemsWithPortions.length === 0
    ) {
      // No pantry items with portions, so we can't check fulfillment
      return false;
    }

    if (!concreteIngredient.ingredient) {
      // No ingredient associated with the concrete ingredient
      throw new BadRequestException(
        `Concrete ingredient with id ${id} has no associated ingredient`,
      );
    }

    // Check if the ingredient has a required amount
    const requiredAmount = concreteIngredient.ingredient.measurement;

    if (!requiredAmount || requiredAmount.magnitude <= 0) {
      // No required amount, so we can't check fulfillment
      return false;
    }

    // Check if the required amount is fulfilled by the pantry items
    const totalFulfilledAmount =
      concreteIngredient.pantryItemsWithPortions.reduce(
        (total, item) => {
          return (
            total +
            convertCookingMeasurement(item.portion, requiredAmount.unit)
              .magnitude
          );
        },

        0,
      );

    // Check if total fulfilled amount is greater than or equal to the required amount
    if (totalFulfilledAmount >= requiredAmount.magnitude) {
      return true; // Fulfilled
    }

    return false; // Not fulfilled
  }

  public async consumeIngredientWithManager(
    manager: EntityManager,
    id: string,
  ): Promise<IConcreteIngredient> {
    const concreteIngredient = await manager.findOne(ConcreteIngredientEntity, {
      where: { id },
      relations: ['pantryItemsWithPortions'],
    });

    if (!concreteIngredient) {
      throw new BadRequestException(
        `Concrete ingredient with id ${id} not found`,
      );
    }

    // Consume the pantry item portions
    await Promise.all(
      concreteIngredient.pantryItemsWithPortions.map(
        async (x) =>
          await this.pantryItemPortionService.consumeWithManager(manager, {
            pantryItemId: x.pantryItemId,
            measurement: x.portion,
          }),
      ),
    );

    return concreteIngredient;
  }
}
