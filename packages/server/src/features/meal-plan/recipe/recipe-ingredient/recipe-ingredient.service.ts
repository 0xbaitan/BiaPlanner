import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeIngredientEntity } from './recipe-ingredient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecipeIngredientService {
  constructor(
    @InjectRepository(RecipeIngredientEntity)
    private recipeIngredientRepository: Repository<RecipeIngredientEntity>,
  ) {}

  async findAll() {
    return this.recipeIngredientRepository.find();
  }
}
