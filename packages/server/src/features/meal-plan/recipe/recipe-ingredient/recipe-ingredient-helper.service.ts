import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeIngredientEntity } from './recipe-ingredient.entity';
import {
  IRecipeIngredient,
  IWriteRecipeIngredientDto,
} from '@biaplanner/shared';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class RecipeIngredientHelperService {
  constructor(
    @InjectRepository(RecipeIngredientEntity)
    private readonly recipeIngredientRepository: Repository<IRecipeIngredient>,
  ) {}

  async updateExistingRecipeIngredients(
    recipeId: string,
    ingredients: IWriteRecipeIngredientDto[],
  ) {
    const existingIngredients = await this.recipeIngredientRepository.find({
      where: { recipeId },
    });

    if (ingredients.length === 0 && existingIngredients.length > 0) {
      await this.recipeIngredientRepository.remove(existingIngredients);
      return [];
    }

    if (existingIngredients.length === 0) {
      return this.recipeIngredientRepository.save(ingredients);
    }

    const deletedIngredients = existingIngredients.filter(
      (existingIngredient) =>
        !ingredients.some(
          (ingredient) => ingredient.id === existingIngredient.id,
        ),
    );

    if (deletedIngredients.length > 0) {
      await this.recipeIngredientRepository.remove(deletedIngredients);
    }

    const updatedIngredients = ingredients.map((ingredient) => {
      const existingIngredient = existingIngredients.find(
        (i) => i.id === ingredient.id,
      );
      if (existingIngredient) {
        return this.recipeIngredientRepository.merge(
          existingIngredient,
          ingredient,
        );
      }
      return ingredient;
    });

    const newIngredients = updatedIngredients
      .filter((ingredient) => !ingredient.id)
      .map((ingredient) =>
        this.recipeIngredientRepository.create({
          ...ingredient,
          recipeId,
        }),
      );

    return this.recipeIngredientRepository.save(
      [...updatedIngredients, ...newIngredients], // Save both updated and new ingredients
    );
  }

  async updateExistingRecipeIngredientsWithManager(
    manager: EntityManager,
    recipeId: string,
    ingredients: IWriteRecipeIngredientDto[],
  ): Promise<IRecipeIngredient[]> {
    const existingIngredients = await manager.find(RecipeIngredientEntity, {
      where: { recipeId },
    });

    if (ingredients.length === 0 && existingIngredients.length > 0) {
      await manager.remove(RecipeIngredientEntity, existingIngredients);
      return [];
    }

    if (existingIngredients.length === 0) {
      const newIngredients = ingredients.map((ingredient) =>
        manager.create(RecipeIngredientEntity, {
          ...ingredient,
          recipeId,
        }),
      );
      return manager.save(RecipeIngredientEntity, newIngredients);
    }

    const deletedIngredients = existingIngredients.filter(
      (existingIngredient) =>
        !ingredients.some(
          (ingredient) => ingredient.id === existingIngredient.id,
        ),
    );

    if (deletedIngredients.length > 0) {
      await manager.remove(RecipeIngredientEntity, deletedIngredients);
    }

    const updatedIngredients = ingredients.map((ingredient) => {
      const existingIngredient = existingIngredients.find(
        (i) => i.id === ingredient.id,
      );
      if (existingIngredient) {
        return manager.merge(
          RecipeIngredientEntity,
          existingIngredient,
          ingredient,
        );
      }
      return manager.create(RecipeIngredientEntity, {
        ...ingredient,
        recipeId,
      });
    });

    return manager.save(RecipeIngredientEntity, updatedIngredients);
  }
}
