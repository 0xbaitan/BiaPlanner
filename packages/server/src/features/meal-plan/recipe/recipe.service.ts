import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity';
import { Repository } from 'typeorm';
import {
  IRecipe,
  ICreateRecipeDto,
  IUpdateRecipeDto,
} from '@biaplanner/shared';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
  ) {}

  async findOne(id: string): Promise<IRecipe> {
    return this.recipeRepository.findOneOrFail({
      where: { id },
      relations: ['cuisine', 'ingredients', 'tags'],
    });
  }
  async findAll(): Promise<IRecipe[]> {
    return this.recipeRepository.find({
      relations: ['cuisine', 'ingredients', 'tags'],
      cache: {
        id: 'recipe-cache',
        milliseconds: 1000 * 60 * 60, // 1 hour
      },
    });
  }

  async createRecipe(dto: ICreateRecipeDto): Promise<IRecipe> {
    const recipe = this.recipeRepository.create(dto);
    return this.recipeRepository.save(recipe);
  }

  async updateRecipe(id: string, dto: IUpdateRecipeDto): Promise<IRecipe> {
    const recipe = await this.findOne(id);
    delete recipe.ingredients;
    delete recipe.tags;
    const updatedRecipe = this.recipeRepository.merge(recipe, dto);

    return this.recipeRepository.save(updatedRecipe);
  }

  async deleteRecipe(id: string): Promise<void> {
    await this.recipeRepository.softDelete(id);
  }
}
