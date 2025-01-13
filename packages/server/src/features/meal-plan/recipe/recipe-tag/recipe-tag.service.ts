import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeTagEntity } from './recipe-tag.entity';
import { Repository } from 'typeorm';
import { IRecipeTag } from '@biaplanner/shared';

@Injectable()
export class RecipeTagService {
  constructor(
    @InjectRepository(RecipeTagEntity)
    private recipeTagRepository: Repository<RecipeTagEntity>,
  ) {}

  async findAll(): Promise<IRecipeTag[]> {
    return this.recipeTagRepository.find();
  }
}
