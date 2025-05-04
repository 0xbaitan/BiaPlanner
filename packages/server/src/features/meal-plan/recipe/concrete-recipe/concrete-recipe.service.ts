import {
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
        'confirmedIngredients',
        'confirmedIngredients.pantryItemsWithPortions',
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

    // Return the created concrete recipe with relations
    return manager.findOneOrFail(ConcreteRecipeEntity, {
      where: { id: createdRecipeId },
    });
  }
}
