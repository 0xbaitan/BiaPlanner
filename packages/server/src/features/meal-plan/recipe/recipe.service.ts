import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity';
import { Repository } from 'typeorm';
import { IRecipe, IWriteRecipeDto } from '@biaplanner/shared';

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
    });
  }

  async createRecipe(dto: IWriteRecipeDto): Promise<IRecipe> {
    const recipe = this.recipeRepository.create(dto);
    return this.recipeRepository.save(recipe);
  }

  async updateRecipe(id: string, dto: IWriteRecipeDto): Promise<IRecipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
    });

    if (!recipe) {
      throw new Error('Recipe not found');
    }
    return this.recipeRepository.save(dto);
  }

  async deleteRecipe(id: string): Promise<void> {
    await this.recipeRepository.softDelete(id);
  }
}
