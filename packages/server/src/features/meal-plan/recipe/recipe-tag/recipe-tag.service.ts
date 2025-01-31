import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeTagEntity } from './recipe-tag.entity';
import { Repository } from 'typeorm';
import {
  ICreateRecipeTagDto,
  IRecipeTag,
  IUpdateRecipeTagDto,
} from '@biaplanner/shared';

@Injectable()
export class RecipeTagService {
  constructor(
    @InjectRepository(RecipeTagEntity)
    private recipeTagRepository: Repository<RecipeTagEntity>,
  ) {}

  async findAll(): Promise<IRecipeTag[]> {
    return this.recipeTagRepository.find();
  }

  async findOne(id: string): Promise<IRecipeTag> {
    return this.recipeTagRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        recipes: true,
      },
    });
  }

  async create(dto: ICreateRecipeTagDto): Promise<IRecipeTag> {
    const recipeTag = this.recipeTagRepository.create(dto);
    return this.recipeTagRepository.save(recipeTag);
  }

  async update(id: string, dto: IUpdateRecipeTagDto): Promise<IRecipeTag> {
    const recipeTag = await this.findOne(id);
    const updatedRecipeTag = this.recipeTagRepository.merge(recipeTag, dto);
    return this.recipeTagRepository.save(updatedRecipeTag);
  }

  async delete(id: string): Promise<void> {
    await this.recipeTagRepository.softDelete(id);
  }
}
