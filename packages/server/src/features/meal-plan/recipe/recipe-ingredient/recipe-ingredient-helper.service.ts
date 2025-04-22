import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeIngredientEntity } from './recipe-ingredient.entity';
import {
  IRecipeIngredient,
  IWriteRecipeIngredientDto,
} from '@biaplanner/shared';
import { Repository } from 'typeorm';

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
}
