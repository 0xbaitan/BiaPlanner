import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ConcreteRecipeEntity } from './concrete-recipe.entity';
import { DataSource, Repository, EntityManager } from 'typeorm';

import { ConcreteIngredientService } from '../concrete-ingredient/concrete-ingredient.service';
import { IConcreteRecipe, IWriteConcreteRecipeDto } from '@biaplanner/shared';
import dataSource from '@/db/ormconfig';
import { TransactionContext } from '@/util/transaction-context';

@Injectable()
export class ConcreteRecipeService {
  constructor(
    @InjectRepository(ConcreteRecipeEntity)
    private readonly concreteRecipeRepository: Repository<ConcreteRecipeEntity>,
    @Inject(ConcreteIngredientService)
    private readonly concreteIngredientService: ConcreteIngredientService,
    private readonly transactionContext: TransactionContext,
  ) {}

  /**
   * Find a single concrete recipe by ID.
   */
  async findOne(id: string): Promise<IConcreteRecipe> {
    return this.concreteRecipeRepository.findOneOrFail({
      where: { id },
      relations: [
        'recipe',
        'recipe.ingredients',
        'recipe.coverImage',
        'confirmedIngredients',
        'confirmedIngredients.pantryItemsWithPortions',
        'confirmedIngredients.pantryItemsWithPortions.pantryItem',
      ],
    });
  }

  /**
   * Find all concrete recipes.
   */
  async findAll(): Promise<IConcreteRecipe[]> {
    return this.concreteRecipeRepository.find({
      relations: ['recipe'],
    });
  }

  /**
   * Create a concrete recipe.
   */
  async create(dto: IWriteConcreteRecipeDto): Promise<IConcreteRecipe> {
    return this.createWithManager(this.concreteRecipeRepository.manager, dto);
  }

  /**
   * Create a concrete recipe using an EntityManager.
   */
  async createWithManager(
    manager: EntityManager,
    dto: IWriteConcreteRecipeDto,
  ): Promise<IConcreteRecipe> {
    return this.createConcreteRecipe(manager, dto);
  }

  /**
   * Helper function to create a concrete recipe.
   */
  private async createConcreteRecipe(
    manager: EntityManager,
    dto: IWriteConcreteRecipeDto,
  ): Promise<IConcreteRecipe> {
    const { confirmedIngredients, ...recipeDto } = dto;

    // Create the concrete recipe
    const concreteRecipe = manager.create(ConcreteRecipeEntity, recipeDto);
    concreteRecipe.isCooked = false;
    concreteRecipe.isSufficient = false;
    const result = await manager.insert(ConcreteRecipeEntity, concreteRecipe);

    if (!result.identifiers.length) {
      throw new InternalServerErrorException(
        'Failed to create concrete recipe',
      );
    }

    const createdRecipeId = result.identifiers[0].id;

    // Create concrete ingredients
    await Promise.all(
      confirmedIngredients.map((ingredient) =>
        this.concreteIngredientService.createWithManager(manager, {
          ...ingredient,
          concreteRecipeId: createdRecipeId,
        }),
      ),
    );

    // Update status of the concrete recipe
    await this.updateSufficientStatusWithManager(manager, createdRecipeId);

    // Return the created concrete recipe with relations
    return manager.findOneOrFail(ConcreteRecipeEntity, {
      where: { id: createdRecipeId },
    });
  }

  private async updateWithManager(
    manager: EntityManager,
    id: string,
    dto: IWriteConcreteRecipeDto,
  ): Promise<IConcreteRecipe> {
    const existingConcreteRecipe = await manager.findOneOrFail(
      ConcreteRecipeEntity,
      {
        where: { id },
        relations: ['confirmedIngredients'],
      },
    );

    const { confirmedIngredients, ...recipeDto } = dto;

    confirmedIngredients.forEach((ingredient) => {
      if (!ingredient.id) {
        throw new InternalServerErrorException(
          'Ingredient ID is required for update',
        );
      }

      ingredient.concreteRecipeId = existingConcreteRecipe.id;
    });

    // Update concrete recipe ingredients
    await Promise.all(
      confirmedIngredients.map(async (ingredient) =>
        this.concreteIngredientService.updateWithManager(
          manager,
          ingredient.id,
          ingredient,
        ),
      ),
    );

    // Update the concrete recipe
    await manager.update(ConcreteRecipeEntity, id, recipeDto);

    // Update the sufficient status of the concrete recipe
    await this.updateSufficientStatusWithManager(manager, id);

    // Return the updated concrete recipe with relations
    return manager.findOneOrFail(ConcreteRecipeEntity, {
      where: { id },
      relations: ['confirmedIngredients'],
    });
  }

  /**
   * Update a concrete recipe.
   */
  async update(
    id: string,
    dto: IWriteConcreteRecipeDto,
  ): Promise<IConcreteRecipe> {
    return this.updateWithManager(
      this.concreteRecipeRepository.manager,
      id,
      dto,
    );
  }

  async updateWithTransaction(
    id: string,
    dto: IWriteConcreteRecipeDto,
  ): Promise<IConcreteRecipe> {
    return this.transactionContext.execute(async (manager: EntityManager) => {
      return this.updateWithManager(manager, id, dto);
    });
  }

  /**
   * Delete with manager.
   *
   */
  async deleteWithManager(manager: EntityManager, id: string): Promise<void> {
    const concreteRecipe = await manager.findOneOrFail(ConcreteRecipeEntity, {
      where: { id },
      relations: ['confirmedIngredients'],
    });

    // Delete concrete ingredients
    await Promise.all(
      concreteRecipe.confirmedIngredients.map((ingredient) =>
        this.concreteIngredientService.deleteWithManager(
          manager,
          ingredient.id,
        ),
      ),
    );

    // Delete the concrete recipe
    await manager.delete(ConcreteRecipeEntity, id);
  }

  /**
   * Delete a concrete recipe.
   */
  async delete(id: string): Promise<void> {
    return this.deleteWithManager(this.concreteRecipeRepository.manager, id);
  }

  /**
   * Delete a concrete recipe with transaction.
   */
  async deleteWithTransaction(id: string): Promise<void> {
    return this.transactionContext.execute(async (manager: EntityManager) => {
      return this.deleteWithManager(manager, id);
    });
  }

  private async updateSufficientStatusWithManager(
    manager: EntityManager,
    id: string,
  ) {
    const concreteRecipe = await manager.findOne(ConcreteRecipeEntity, {
      where: { id },
      relations: ['confirmedIngredients'],
    });

    if (!concreteRecipe) {
      throw new InternalServerErrorException(
        `Concrete recipe with ID ${id} not found`,
      );
    }

    // Check if all concrete ingredients are sufficient
    const sufficientStatuses = await Promise.all(
      concreteRecipe.confirmedIngredients.map(async (ingredient) =>
        this.concreteIngredientService.checkFulfillmenWithManager(
          manager,
          ingredient.id,
        ),
      ),
    );

    const allSufficient = sufficientStatuses.every((status) => !!status);

    // Update the concrete recipe's sufficient status
    await manager.update(ConcreteRecipeEntity, id, {
      isSufficient: allSufficient, // False if any ingredient is not sufficient
    });
  }

  public async markAsCooked(id: string): Promise<IConcreteRecipe> {
    return this.transactionContext.execute(async (manager: EntityManager) => {
      return this.markAsCookedWithManager(manager, id);
    });
  }

  public async markAsCookedWithTransaction(
    id: string,
  ): Promise<IConcreteRecipe> {
    return this.transactionContext.execute(async (manager: EntityManager) => {
      return this.markAsCookedWithManager(manager, id);
    });
  }

  public async markAsCookedWithManager(
    manager: EntityManager,
    id: string,
  ): Promise<IConcreteRecipe> {
    const concreteRecipe = await manager.findOne(ConcreteRecipeEntity, {
      where: { id },
      relations: ['confirmedIngredients'],
    });

    if (!concreteRecipe) {
      throw new BadRequestException(`Concrete recipe with ID ${id} not found`);
    }

    if (concreteRecipe.isCooked) {
      throw new BadRequestException(
        `Concrete recipe with ID ${id} is already marked as cooked`,
      );
    }

    if (!concreteRecipe.isSufficient) {
      throw new BadRequestException(
        `Concrete recipe with ID ${id} is not sufficient`,
      );
    }

    await Promise.all(
      concreteRecipe.confirmedIngredients.map(async (ingredient) => {
        await this.concreteIngredientService.consumeIngredientWithManager(
          manager,
          ingredient.id,
        );
      }),
    );

    // Mark the concrete recipe as cooked
    await manager.update(ConcreteRecipeEntity, id, {
      isCooked: true,
    });

    // Return the updated concrete recipe with relations
    return manager.findOneOrFail(ConcreteRecipeEntity, {
      where: { id },
      relations: ['confirmedIngredients'],
    });
  }
}
