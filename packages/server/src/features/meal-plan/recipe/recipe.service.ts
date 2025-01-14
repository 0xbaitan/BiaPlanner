import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity';
import { Repository } from 'typeorm';
import { IRecipe, ICreateRecipeDto } from '@biaplanner/shared';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
  ) {}

  async findAll(): Promise<IRecipe[]> {
    return this.recipeRepository.find({
      relations: ['cuisine', 'ingredients', 'tags'],
    });
  }

  async createRecipe(dto: ICreateRecipeDto): Promise<IRecipe> {
    const recipe = this.recipeRepository.create(dto);
    return this.recipeRepository.save(recipe);
  }
}
