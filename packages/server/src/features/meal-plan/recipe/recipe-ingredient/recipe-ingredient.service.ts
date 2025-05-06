import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeIngredientEntity } from './recipe-ingredient.entity';
import { Repository, EntityManager } from 'typeorm';
import { IRecipeIngredient } from '@biaplanner/shared';
import { TransactionContext } from '@/util/transaction-context';

@Injectable()
export class RecipeIngredientService {
  constructor(
    @InjectRepository(RecipeIngredientEntity)
    private readonly recipeIngredientRepository: Repository<RecipeIngredientEntity>,
    private readonly transactionContext: TransactionContext,
  ) {}

  async findOne(id: string): Promise<IRecipeIngredient> {
    return this.recipeIngredientRepository.findOneOrFail({
      where: { id },
      relations: ['productCategories'],
    });
  }

  async findAll(): Promise<IRecipeIngredient[]> {
    return this.recipeIngredientRepository.find();
  }

  async findRecipeIngredients(recipeId: string): Promise<IRecipeIngredient[]> {
    return this.recipeIngredientRepository.find({
      where: { recipeId },
    });
  }

  async getRecipeIngredient(ingredientId: string): Promise<IRecipeIngredient> {
    return this.recipeIngredientRepository.findOneOrFail({
      where: { id: ingredientId },
      relations: ['productCategories'],
    });
  }

  async createRecipeIngredient(
    ingredient: Partial<IRecipeIngredient>,
  ): Promise<IRecipeIngredient> {
    return this.transactionContext.execute(async (manager) => {
      return this.createRecipeIngredientWithManager(manager, ingredient);
    });
  }

  private async createRecipeIngredientWithManager(
    manager: EntityManager,
    ingredient: Partial<IRecipeIngredient>,
  ): Promise<IRecipeIngredient> {
    const newIngredient = manager.create(RecipeIngredientEntity, ingredient);
    return manager.save(RecipeIngredientEntity, newIngredient);
  }

  async updateRecipeIngredient(
    id: string,
    ingredient: Partial<IRecipeIngredient>,
  ): Promise<IRecipeIngredient> {
    return this.transactionContext.execute(async (manager) => {
      return this.updateRecipeIngredientWithManager(manager, id, ingredient);
    });
  }

  private async updateRecipeIngredientWithManager(
    manager: EntityManager,
    id: string,
    ingredient: Partial<IRecipeIngredient>,
  ): Promise<IRecipeIngredient> {
    const existingIngredient = await manager.findOne(RecipeIngredientEntity, {
      where: { id },
    });

    if (!existingIngredient) {
      throw new Error(`Recipe ingredient with id ${id} not found`);
    }

    const updatedIngredient = {
      ...existingIngredient,
      ...ingredient,
    };

    await manager.save(RecipeIngredientEntity, updatedIngredient);

    return manager.findOneOrFail(RecipeIngredientEntity, {
      where: { id },
      relations: ['productCategories'],
    });
  }

  async deleteRecipeIngredient(id: string): Promise<void> {
    return this.transactionContext.execute(async (manager) => {
      return this.deleteRecipeIngredientWithManager(manager, id);
    });
  }

  private async deleteRecipeIngredientWithManager(
    manager: EntityManager,
    id: string,
  ): Promise<void> {
    await manager.softDelete(RecipeIngredientEntity, id);
  }
}
