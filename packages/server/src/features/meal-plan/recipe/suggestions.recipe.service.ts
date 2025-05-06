import { ComputeExpiryDatesService } from '@/features/pantry/pantry-item/compute-expiry-dates.service';
import {
  IPantryItem,
  IProductCategory,
  IRecipe,
  IRecipeIngredient,
} from '@biaplanner/shared';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';
import { similarity } from 'ml-distance';
import convertCookingMeasurement from '@biaplanner/shared/build/util/CookingMeasurementConversion';
import dayjs from 'dayjs';

export type BinaryMatrix = {
  matrix: number[][];
  rows: string[];
  columns: string[];
};

export class RecipeSuggestionsService {
  constructor(
    @Inject(ComputeExpiryDatesService)
    private computeExpiryDatesService: ComputeExpiryDatesService,
    @Inject(RecipeService)
    private recipeService: RecipeService,
  ) {}

  private getRow(m: BinaryMatrix, rowIndex: number): number[] {
    return m.matrix[rowIndex];
  }

  private mergeUniqueProductCategories(
    a: IProductCategory[],
    b: IProductCategory[],
  ): string[] {
    const mergedCategories = new Set<string>();
    a.forEach((category) => {
      mergedCategories.add(category.name);
    });
    b.forEach((category) => {
      mergedCategories.add(category.name);
    });
    return Array.from(mergedCategories);
  }

  private computeBooleanMatrixForPantryItems(
    items: IPantryItem[],
    uniqueProductCategories: string[],
  ): BinaryMatrix {
    const rows: string[] = [];
    const columns: string[] = uniqueProductCategories;

    const matrix = items.map((item) => {
      const productCategories = item.product.productCategories ?? [];
      const row: number[] = new Array(uniqueProductCategories.length).fill(0);
      productCategories.forEach((category) => {
        const index = uniqueProductCategories.indexOf(category.name);
        if (index !== -1) {
          row[index] = 1;
        }
      });
      rows.push(item.id);
      return row;
    });

    return { matrix, rows, columns };
  }

  private computeBooleanMatrixForRecipeIngredients(
    recipe: IRecipe,
    uniqueProductCategories: string[],
  ): BinaryMatrix {
    const rows: string[] = [];
    const columns: string[] = uniqueProductCategories;

    const matrix = recipe.ingredients.map((ingredient) => {
      const productCategories = ingredient.productCategories ?? [];
      const row: number[] = new Array(uniqueProductCategories.length).fill(0);
      productCategories.forEach((category) => {
        const index = uniqueProductCategories.indexOf(category.name);
        if (index !== -1) {
          row[index] = 1;
        }
      });
      rows.push(ingredient.id);
      return row;
    });

    return { matrix, rows, columns };
  }

  /**
   * Computes the product category binary matrix for all items in the current pantry.
   * @param userId - The ID of the user for whom to compute the matrix.
   * @returns A promise that resolves to the product category binary matrix.
   */
  private computeProductCategoryBinaryMatrices(
    items: IPantryItem[],
    recipe: IRecipe,
  ): {
    pantryItemBinaryMatrix: BinaryMatrix;
    recipeBinaryMatrix: BinaryMatrix;
    uniqueProductCategories: string[];
  } {
    const recipeIngredientProductCategories = recipe.ingredients.flatMap(
      (ingredient) => ingredient.productCategories,
    );
    const pantryItemProductCategories = items.flatMap(
      (item) => item.product.productCategories,
    );
    const uniqueProductCategories = this.mergeUniqueProductCategories(
      pantryItemProductCategories,
      recipeIngredientProductCategories,
    );
    const pantryItemBinaryMatrix = this.computeBooleanMatrixForPantryItems(
      items,
      uniqueProductCategories,
    );
    const recipeBinaryMatrix = this.computeBooleanMatrixForRecipeIngredients(
      recipe,
      uniqueProductCategories,
    );

    return {
      pantryItemBinaryMatrix,
      recipeBinaryMatrix,
      uniqueProductCategories,
    };
  }

  private computeCosineSimilary(
    pantryItemBinaryMatrix: BinaryMatrix,
    recipeBinaryMatrix: BinaryMatrix,
  ) {
    const pantryItemMatrix = pantryItemBinaryMatrix.matrix;
    const recipeMatrix = recipeBinaryMatrix.matrix;
    const pantryItemRows = pantryItemBinaryMatrix.rows;
    const ingredientRows = recipeBinaryMatrix.rows;

    const similarityMatrix: number[][] = [];
    for (let i = 0; i < pantryItemMatrix.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < recipeMatrix.length; j++) {
        const sim = similarity.cosine(pantryItemMatrix[i], recipeMatrix[j]);
        row.push(sim);
      }
      similarityMatrix.push(row);
    }
    const result: BinaryMatrix = {
      matrix: similarityMatrix,
      rows: pantryItemRows,
      columns: ingredientRows,
    };
    return result;
  }

  private calculateExpiryFactor(pantryItem: IPantryItem, maxDaysLeft = 30) {
    if (!pantryItem.expiryDate || !pantryItem.product.canExpire) {
      return 0;
    }
    const expiryDate = dayjs(pantryItem.expiryDate);
    const today = dayjs();
    const daysLeft = expiryDate.diff(today, 'day');

    const expiryFactor = 1 - Math.max(0, daysLeft) / maxDaysLeft;
    return expiryFactor;
  }
  private calculateUsageFactor(
    pantryItem: IPantryItem,
    ingredient: IRecipeIngredient,
  ) {
    if (
      !pantryItem.totalMeasurements ||
      !pantryItem.consumedMeasurements ||
      !ingredient.measurement
    ) {
      return 0;
    }
    const unitUsed = ingredient.measurement?.unit;
    const unconsumedAmount =
      convertCookingMeasurement(pantryItem.totalMeasurements, unitUsed)
        .magnitude -
      convertCookingMeasurement(pantryItem.consumedMeasurements, unitUsed)
        .magnitude;
    const ingredientAmount = convertCookingMeasurement(
      ingredient.measurement,
      unitUsed,
    ).magnitude;
    const usageFactor =
      1 - Math.max(0, unconsumedAmount - ingredientAmount) / unconsumedAmount;
    return usageFactor;
  }

  private identifyRelevantIngredientsForPantryItem(
    similarityMatrix: BinaryMatrix,
    pantryItemId: string,
    cutOff: number = 0.5,
  ) {
    const pantryItemIds = similarityMatrix.rows;
    const ingredientIds = similarityMatrix.columns;
    const pantryItemIndex = pantryItemIds.indexOf(pantryItemId);
    if (pantryItemIndex === -1) {
      throw new Error(`Pantry item ID ${pantryItemId} not found`);
    }
    const ingredientSimilarities = this.getRow(
      similarityMatrix,
      pantryItemIndex,
    );
    const relevantIngredients: string[] = [];

    ingredientSimilarities.forEach((similarity, index) => {
      if (similarity >= cutOff) {
        relevantIngredients.push(ingredientIds[index]);
      }
    });
    return relevantIngredients;
  }

  private computePantryItemRelevanceInRecipe(
    similarityMatrix: BinaryMatrix,
    pantryItemId: string,
    ingredients: IRecipeIngredient[],
    pantryItems: IPantryItem[],
  ) {
    const relevantIngredients = this.identifyRelevantIngredientsForPantryItem(
      similarityMatrix,
      pantryItemId,
      0.5,
    );
    if (relevantIngredients.length === 0) {
      return 0;
    }
    const pantryItem = pantryItems.find((item) => item.id === pantryItemId);

    if (!pantryItem) {
      throw new Error(`Pantry item ID ${pantryItemId} not found`);
    }

    const usageFactors = relevantIngredients.map((ingredientId) => {
      const ingredient = ingredients.find(
        (ingredient) => ingredient.id === ingredientId,
      );
      if (!ingredient) {
        throw new Error(`Ingredient ID ${ingredientId} not found`);
      }
      return this.calculateUsageFactor(pantryItem, ingredient);
    });
    const maxUsageFactor =
      usageFactors.reduce((max, factor) => Math.max(max, factor), 0) || 0;

    const expiryFactor = this.calculateExpiryFactor(pantryItem);
    const pantryItemRelevance = (
      0.6 * expiryFactor +
      0.4 * maxUsageFactor
    ).toFixed(2);
    return Number(pantryItemRelevance);
  }

  private computePantryRelevanceForRecipe(
    pantryItems: IPantryItem[],
    recipe: IRecipe,
  ) {
    const ingredients = recipe.ingredients;

    const { pantryItemBinaryMatrix, recipeBinaryMatrix } =
      this.computeProductCategoryBinaryMatrices(pantryItems, recipe);
    const similarityMatrix = this.computeCosineSimilary(
      pantryItemBinaryMatrix,
      recipeBinaryMatrix,
    );
    const scores = pantryItems.map((pantryItem) => {
      const pantryItemRelevance = this.computePantryItemRelevanceInRecipe(
        similarityMatrix,
        pantryItem.id,
        ingredients,
        pantryItems,
      );
      return pantryItemRelevance;
    });

    const average =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return average;
  }

  public async computeRecipeSuggestions(
    userId: string,
    maxDaysLeftThreshold = 7,
  ) {
    const pantryItems = await this.computeExpiryDatesService.findExpiringItems(
      userId,
      maxDaysLeftThreshold,
    );
    const recipes = await this.recipeService.findAll();

    const recipeScores = recipes.map((recipe) => {
      let pantryRelevance = this.computePantryRelevanceForRecipe(
        pantryItems,
        recipe,
      );
      pantryRelevance = Number.isNaN(pantryRelevance) ? 0 : pantryRelevance;
      return { recipe, pantryRelevance: pantryRelevance };
    });
    const sortedRecipes = recipeScores
      .filter((r) => r.pantryRelevance > 0)
      .sort((a, b) => b.pantryRelevance - a.pantryRelevance);

    return sortedRecipes.slice(0, 10);
  }
}
