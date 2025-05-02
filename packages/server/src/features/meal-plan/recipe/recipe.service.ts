import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity';
import { Repository } from 'typeorm';
import { IRecipe, IWriteRecipeDto } from '@biaplanner/shared';
import { RecipeIngredientHelperService } from './recipe-ingredient/recipe-ingredient-helper.service';
import { RecipeTagHelperService } from './recipe-tag/recipe-tag-helper.service';
import { ManageRecipeImagesService } from './manage-recipe-images.service';
import { DeepPartial } from 'utility-types';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
    @Inject(RecipeIngredientHelperService)
    private readonly recipeIngredientHelperService: RecipeIngredientHelperService,
    @Inject(RecipeTagHelperService)
    private readonly recipeTagHelperService: RecipeTagHelperService,
    @Inject(ManageRecipeImagesService)
    private readonly manageRecipeImagesService: ManageRecipeImagesService,
  ) {}

  async findOne(id: string): Promise<IRecipe> {
    return this.recipeRepository.findOneOrFail({
      where: { id },
      relations: ['cuisine', 'ingredients', 'tags', 'coverImage'],
    });
  }
  async findAll(): Promise<IRecipe[]> {
    return this.recipeRepository.find({
      relations: ['cuisine', 'ingredients', 'tags', 'coverImage'],
    });
  }

  async createRecipe(
    dto: IWriteRecipeDto,
    file: Express.Multer.File,
  ): Promise<IRecipe> {
    delete dto.file;
    const recipe = this.recipeRepository.create(dto as DeepPartial<IRecipe>);

    const savedRecipe = await this.recipeRepository.save(recipe);
    if (file) {
      await this.manageRecipeImagesService.manageRecipeCoverImage(
        recipe.id,
        file,
      );
    }
    return savedRecipe;
  }

  async updateRecipe(
    id: string,
    dto: IWriteRecipeDto,
    file: Express.Multer.File,
  ): Promise<IRecipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
    });
    if (!recipe) {
      throw new Error(`Recipe with id ${id} not found`);
    }
    const { ingredients, tags, ...rest } = dto;
    if (ingredients && ingredients.length > 0) {
      await this.recipeIngredientHelperService.updateExistingRecipeIngredients(
        id,
        ingredients,
      );
    }
    if (tags && tags.length > 0) {
      await this.recipeTagHelperService.updateExistingRecipeTags(id, tags);
    }
    await this.recipeRepository.update(id, rest as DeepPartial<IRecipe>);
    const savedRecipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['cuisine', 'ingredients', 'tags'],
    });

    this.manageRecipeImagesService.manageRecipeCoverImage(id, file);

    return savedRecipe;
  }

  async deleteRecipe(id: string): Promise<void> {
    await this.recipeRepository.softDelete(id);
  }
}
