import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeIngredientEntity } from './recipe-ingredient.entity';
import { Repository } from 'typeorm';
import { IRecipeIngredient } from '@biaplanner/shared';

@Injectable()
export class RecipeIngredientService {
  constructor(
    @InjectRepository(RecipeIngredientEntity)
    private recipeIngredientRepository: Repository<RecipeIngredientEntity>,
  ) {}

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
}
