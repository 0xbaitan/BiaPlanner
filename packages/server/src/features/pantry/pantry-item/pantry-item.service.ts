import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PantryItemEntity } from './pantry-item.entity';
import { Between, In, Repository } from 'typeorm';
import {
  CreatePantryItemDto,
  ICreatePantryItemDto,
  IPantryItem,
} from '@biaplanner/shared';
import { ProductService } from '../product/product.service';
import { ProductCategoryService } from '../product/category/product-category.service';
import { RecipeIngredientService } from '@/features/meal-plan/recipe/recipe-ingredient/recipe-ingredient.service';

@Injectable()
export default class PantryItemService {
  constructor(
    @InjectRepository(PantryItemEntity)
    private pantryItemRepository: Repository<PantryItemEntity>,
    @Inject(RecipeIngredientService)
    private recipeIngredientService: RecipeIngredientService,
  ) {}

  async createPantryItem(
    dto: ICreatePantryItemDto,
    createdById: string,
  ): Promise<IPantryItem> {
    const pantryItem = this.pantryItemRepository.create({
      ...dto,
      createdById,
    });
    return await this.pantryItemRepository.save(pantryItem);
  }

  async findAllPantryItems(createdById: string): Promise<IPantryItem[]> {
    const userScopedPantryItems = await this.pantryItemRepository.find({
      where: { createdById },
      relations: [
        'createdBy',
        'product',
        'product.brand',
        'product.productCategories',
      ],
    });
    return userScopedPantryItems;
  }

  async findIngredientCompatiblePantryItems(
    ingredientId: string,
  ): Promise<IPantryItem[]> {
    const ingredient =
      await this.recipeIngredientService.getRecipeIngredient(ingredientId);
    const productCategories = ingredient.productCategories;

    console.log('productCategories', productCategories);
    const applicablePantryItems = await this.pantryItemRepository.find({
      where: {
        product: {
          productCategories: {
            id: In(productCategories.map((category) => category.id)),
          },
        },
      },
      relations: ['product', 'product.brand', 'product.productCategories'],
    });

    return applicablePantryItems;
  }
}
