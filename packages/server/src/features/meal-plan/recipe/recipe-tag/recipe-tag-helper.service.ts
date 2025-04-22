import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeTagEntity } from './recipe-tag.entity';
import { Repository } from 'typeorm';
import { IReadEntityDto, IRecipeTag } from '@biaplanner/shared';
import { RecipeEntity } from '../recipe.entity';

@Injectable()
export class RecipeTagHelperService {
  constructor(
    @InjectRepository(RecipeTagEntity)
    private readonly recipeTags: Repository<IRecipeTag>,
  ) {}

  public async updateExistingRecipeTags(
    recipeId: string,
    recipeTags: IReadEntityDto[],
  ) {
    const ids = recipeTags.map((tag) => tag.id);
    const existingTags = await this.recipeTags.find({
      where: {
        recipes: {
          id: recipeId,
        },
      },
    });

    if (existingTags.length > 0 && ids.length > 0) {
      // Remove all existing tags
      await this.recipeTags
        .createQueryBuilder()
        .relation(RecipeEntity, 'tags')
        .of(recipeId)
        .remove(existingTags.map((tag) => tag.id));
    }

    if (ids.length > 0) {
      // Add new tags
      await this.recipeTags
        .createQueryBuilder()
        .relation(RecipeEntity, 'tags')
        .of(recipeId)
        .add(ids);
    }

    return this.recipeTags.find({
      where: {
        recipes: {
          id: recipeId,
        },
      },
    });
  }
}
