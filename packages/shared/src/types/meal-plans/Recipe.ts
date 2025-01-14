import { DifficultyLevels, Time } from "../units";

import { IBaseEntity } from "../BaseEntity";
import { ICuisine } from "./Cuisine";
import { IRecipeIngredient } from "./RecipeIngredient";
import { IRecipeTag } from "./RecipeTag";

export interface IRecipe extends IBaseEntity {
  title: string;
  description?: string;
  instructions: string;
  ingredients: IRecipeIngredient[];
  difficultyLevel: DifficultyLevels;
  cuisineId: string;
  cuisine: ICuisine;
  prepTimeMagnitude: number;
  prepTimeUnit: Time;
  cookTimeMagnitude: number;
  cookTimeUnit: Time;
  defaultNumberOfServings?: [number, number];

  notes?: string;
  source?: string;
  tags?: IRecipeTag[];
}

export interface ICreateRecipeDto extends Omit<IRecipe, "id" | "createdAt" | "updatedAt" | "deletedAt" | "ingredients" | "tags"> {
  ingredientIds: string[];
  newTags?: Pick<IRecipeTag, "name">[];
  tags?: Pick<IRecipeTag, "id">[];
}

export interface IUpdateRecipeDto extends Partial<ICreateRecipeDto> {}

export class CreateRecipeDto implements ICreateRecipeDto {
  ingredientIds: string[];

  title: string;
  description?: string | undefined;
  instructions: string;
  difficultyLevel: DifficultyLevels;
  cuisineId: string;
  cuisine: ICuisine;
  prepTimeMagnitude: number;
  prepTimeUnit: Time;
  cookTimeMagnitude: number;
  cookTimeUnit: Time;
  defaultNumberOfServings?: [number, number];
  notes?: string | undefined;
  source?: string | undefined;
}

export class UpdateRecipeDto implements IUpdateRecipeDto {
  title?: string | undefined;
  description?: string | undefined;
  instructions?: string | undefined;
  difficultyLevel?: DifficultyLevels | undefined;
  cuisineId?: string | undefined;
  cuisine?: ICuisine | undefined;
  prepTimeMagnitude?: number | undefined;
  prepTimeUnit?: Time | undefined;
  cookTimeMagnitude?: number | undefined;
  cookTimeUnit?: Time | undefined;
  defaultNumberOfServings?: [number, number] | undefined;
  notes?: string | undefined;
  source?: string | undefined;
}
