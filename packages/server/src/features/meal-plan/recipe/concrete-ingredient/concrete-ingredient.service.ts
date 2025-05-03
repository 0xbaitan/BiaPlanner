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

      // Create new portions
      const createdPortions = await Promise.all(
        toBeCreatedPortions.map((portion) =>
          this.pantryItemPortionService.createWithManager(manager, portion),
        ),
      );

      // Delete old portions
      await Promise.all(
        toBeDeletedPortions.map((portion) =>
          this.pantryItemPortionService.deleteWithManager(manager, portion.id),
        ),
      );

      // Update relations for the concrete ingredient
      await manager
        .createQueryBuilder()
        .relation(ConcreteIngredientEntity, 'pantryItemsWithPortions')
        .of(concreteIngredient)
        .set([...updatedPortions, ...createdPortions]);

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
}
