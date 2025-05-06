import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity';
import { Repository, EntityManager } from 'typeorm';
import { IRecipe, IWriteRecipeDto } from '@biaplanner/shared';
import { RecipeIngredientHelperService } from './recipe-ingredient/recipe-ingredient-helper.service';
import { RecipeTagHelperService } from './recipe-tag/recipe-tag-helper.service';
import { ManageRecipeImagesService } from './manage-recipe-images.service';
import { DeepPartial } from 'utility-types';
import { TransactionContext } from '@/util/transaction-context';

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
    private readonly transactionContext: TransactionContext,
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
    return this.transactionContext.execute(async (manager) => {
      return this.createRecipeWithManager(manager, dto, file);
    });
  }

  private async createRecipeWithManager(
    manager: EntityManager,
    dto: IWriteRecipeDto,
    file: Express.Multer.File,
  ): Promise<IRecipe> {
    delete dto.file;
    const recipe = manager.create(RecipeEntity, dto as DeepPartial<IRecipe>);
    const savedRecipe = await manager.save(RecipeEntity, recipe);

    if (file) {
      await this.manageRecipeImagesService.manageRecipeCoverImageWithManager(
        manager,
        savedRecipe.id,
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
    return this.transactionContext.execute(async (manager) => {
      return this.updateRecipeWithManager(manager, id, dto, file);
    });
  }

  private async updateRecipeWithManager(
    manager: EntityManager,
    id: string,
    dto: IWriteRecipeDto,
    file: Express.Multer.File,
  ): Promise<IRecipe> {
    const recipe = await manager.findOne(RecipeEntity, { where: { id } });
    if (!recipe) {
      throw new Error(`Recipe with id ${id} not found`);
    }

    const { ingredients, tags, ...rest } = dto;

    if (ingredients && ingredients.length > 0) {
      await this.recipeIngredientHelperService.updateExistingRecipeIngredientsWithManager(
        manager,
        id,
        ingredients,
      );
    }

    if (tags && tags.length > 0) {
      await this.recipeTagHelperService.updateExistingRecipeTagsWithManager(
        manager,
        id,
        tags,
      );
    }

    await manager.update(RecipeEntity, id, rest as DeepPartial<IRecipe>);

    if (file) {
      await this.manageRecipeImagesService.manageRecipeCoverImageWithManager(
        manager,
        id,
        file,
      );
    }

    return manager.findOneOrFail(RecipeEntity, {
      where: { id },
      relations: ['cuisine', 'ingredients', 'tags', 'coverImage'],
    });
  }

  async deleteRecipe(id: string): Promise<void> {
    return this.transactionContext.execute(async (manager) => {
      return this.deleteRecipeWithManager(manager, id);
    });
  }

  private async deleteRecipeWithManager(
    manager: EntityManager,
    id: string,
  ): Promise<void> {
    await manager.softDelete(RecipeEntity, id);
  }
}
