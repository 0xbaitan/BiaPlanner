import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeTagEntity } from './recipe-tag.entity';
import { Repository, EntityManager } from 'typeorm';
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

  public async updateExistingRecipeTagsWithManager(
    manager: EntityManager,
    recipeId: string,
    recipeTags: IReadEntityDto[],
  ): Promise<IRecipeTag[]> {
    const ids = recipeTags.map((tag) => tag.id);

    // Fetch existing tags for the recipe
    const existingTags = await manager.find(RecipeTagEntity, {
      where: {
        recipes: {
          id: recipeId,
        },
      },
    });

    // Remove all existing tags if there are any
    if (existingTags.length > 0 && ids.length > 0) {
      await manager
        .createQueryBuilder()
        .relation(RecipeEntity, 'tags')
        .of(recipeId)
        .remove(existingTags.map((tag) => tag.id));
    }

    // Add new tags if there are any
    if (ids.length > 0) {
      await manager
        .createQueryBuilder()
        .relation(RecipeEntity, 'tags')
        .of(recipeId)
        .add(ids);
    }

    // Return the updated list of tags
    return manager.find(RecipeTagEntity, {
      where: {
        recipes: {
          id: recipeId,
        },
      },
    });
  }
}
