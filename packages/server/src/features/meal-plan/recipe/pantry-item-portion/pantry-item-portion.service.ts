import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { PantryItemPortionEntity } from './pantry-item-portion.entity';
import PantryItemService from '@/features/pantry/pantry-item/pantry-item.service';
import {
  IConcreteIngredient,
  IConsumePantryItemDto,
  IPantryItemPortion,
  IWriteConcreteIngredientDto,
  IWritePantryItemPortionDto,
} from '@biaplanner/shared';
import { ConcreteIngredientEntity } from '../concrete-ingredient/concrete-ingredient.entity';

@Injectable()
export class PantryItemPortionService {
  constructor(
    @InjectRepository(PantryItemPortionEntity)
    private readonly pantryItemPortionRepository: Repository<PantryItemPortionEntity>,
    private readonly pantryItemService: PantryItemService,
  ) {}

  /**
   * Create a new portion and adjust pantry item measurements.
   */
  async create(dto: IWritePantryItemPortionDto): Promise<IPantryItemPortion> {
    return this.createWithManager(
      this.pantryItemPortionRepository.manager,
      dto,
    );
  }

  /**
   * Create a new portion with an EntityManager and adjust pantry item measurements.
   */
  async createWithManager(
    manager: EntityManager,
    dto: IWritePantryItemPortionDto,
  ): Promise<IPantryItemPortion> {
    return this.createPantryItemPortion(manager, dto);
  }

  /**
   * Update an existing portion and adjust pantry item measurements.
   */
  async update(
    id: string,
    dto: IWritePantryItemPortionDto,
  ): Promise<IPantryItemPortion> {
    return this.updateWithManager(
      this.pantryItemPortionRepository.manager,
      id,
      dto,
    );
  }

  /**
   * Update an existing portion with an EntityManager and adjust pantry item measurements.
   */
  async updateWithManager(
    manager: EntityManager,
    id: string,
    dto: IWritePantryItemPortionDto,
  ): Promise<IPantryItemPortion> {
    return this.updatePantryItemPortion(manager, id, dto);
  }

  /**
   * Delete a portion and adjust pantry item measurements.
   */
  async delete(id: string): Promise<void> {
    return this.deleteWithManager(this.pantryItemPortionRepository.manager, id);
  }

  /**
   * Delete a portion with an EntityManager and adjust pantry item measurements.
   */
  async deleteWithManager(manager: EntityManager, id: string): Promise<void> {
    return this.deletePantryItemPortion(manager, id);
  }

  /**
   * Helper function to create a pantry item portion.
   */
  private async createPantryItemPortion(
    manager: EntityManager,
    dto: IWritePantryItemPortionDto,
  ): Promise<IPantryItemPortion> {
    const pantryItemPortion = manager.create(PantryItemPortionEntity, dto);

    // Insert the portion into the database
    const result = await manager.insert(
      PantryItemPortionEntity,
      pantryItemPortion,
    );

    if (!result.identifiers.length) {
      throw new InternalServerErrorException(
        'Failed to create pantry item portion',
      );
    }

    // Set the ID of the created portion
    pantryItemPortion.id = result.identifiers[0].id;

    // Load the pantryItem relation
    const pantryItemPortionWithRelations = await manager.findOneOrFail(
      PantryItemPortionEntity,
      {
        where: { id: pantryItemPortion.id },
        relations: ['pantryItem'],
      },
    );

    // Adjust pantry item measurements
    await this.pantryItemService.reservePortionWithManager(
      manager,
      pantryItemPortionWithRelations,
    );

    // Return the created portion with relations
    return pantryItemPortionWithRelations;
  }

  /**
   * Helper function to update a pantry item portion.
   */
  private async updatePantryItemPortion(
    manager: EntityManager,
    id: string,
    dto: IWritePantryItemPortionDto,
  ): Promise<IPantryItemPortion> {
    const existingPortion = await manager.findOneOrFail(
      PantryItemPortionEntity,
      {
        where: { id },
        relations: ['pantryItem'],
      },
    );

    // Adjust pantry item measurements for the updated portion
    await this.pantryItemService.adjustPortionWithManager(
      manager,
      existingPortion,
      dto,
    );

    // Merge the updated data into the existing portion
    const updatedPortion = manager.merge(
      PantryItemPortionEntity,
      existingPortion,
      dto,
    );

    // Save the updated portion
    return manager.save(PantryItemPortionEntity, updatedPortion);
  }

  /**
   * Helper function to delete a pantry item portion.
   */
  private async deletePantryItemPortion(
    manager: EntityManager,
    id: string,
  ): Promise<void> {
    const pantryItemPortion = await manager.findOneOrFail(
      PantryItemPortionEntity,
      {
        where: { id },
        relations: ['pantryItem'],
      },
    );

    // Adjust pantry item measurements for the deleted portion
    await this.pantryItemService.releasePortionWithManager(
      manager,
      pantryItemPortion,
    );

    // Delete the portion
    const result = await manager.delete(PantryItemPortionEntity, id);
    if (result.affected === 0) {
      throw new InternalServerErrorException(
        'Failed to delete pantry item portion',
      );
    }
  }

  public async consumeWithManager(
    manager: EntityManager,
    dto: IConsumePantryItemDto,
  ): Promise<void> {
    // Adjust pantry item measurements for the consumed portion
    await this.pantryItemService.consumePortionWithManager(
      manager,
      dto.pantryItemId,
      dto,
      true,
    );
  }

  public async findAllForConcreteIngredient(
    concreteIngredientId: string,
  ): Promise<IPantryItemPortion[]> {
    return this.pantryItemPortionRepository.find({
      where: { concreteIngredientId },
    });
  }
}
