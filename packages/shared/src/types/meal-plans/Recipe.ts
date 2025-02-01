import { DifficultyLevels, Time } from "../units";

import { DeepPartial } from "utility-types";
import { IBaseEntity } from "../BaseEntity";
import { ICuisine } from "./Cuisine";
import { IRecipeIngredient } from "./RecipeIngredient";
import { IRecipeTag } from "./RecipeTag";
import z from "zod";

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

export interface ICreateRecipeDto extends Omit<IRecipe, "id" | "createdAt" | "updatedAt" | "deletedAt" | "ingredients" | "tags" | "cuisine"> {
  ingredients: DeepPartial<IRecipeIngredient>[];
  newTags?: Pick<IRecipeTag, "name">[];
  tags?: Pick<IRecipeTag, "id">[];
}

export interface IUpdateRecipeDto extends Partial<ICreateRecipeDto>, Pick<IRecipe, "id"> {}

export class CreateRecipeDto implements ICreateRecipeDto {
  ingredients: DeepPartial<IRecipeIngredient>[];
  newTags?: Pick<IRecipeTag, "name">[] | undefined;
  tags?: Pick<IRecipeTag, "id">[] | undefined;
  title: string;
  description?: string | undefined;
  instructions: string;
  difficultyLevel: DifficultyLevels;
  cuisineId: string;

  prepTimeMagnitude: number;
  prepTimeUnit: Time;
  cookTimeMagnitude: number;
  cookTimeUnit: Time;
  defaultNumberOfServings?: [number, number];
  notes?: string | undefined;
  source?: string | undefined;
}

export class UpdateRecipeDto implements IUpdateRecipeDto {
  id: string;
  title?: string | undefined;
  description?: string | undefined;
  instructions?: string | undefined;
  difficultyLevel?: DifficultyLevels | undefined;
  cuisineId?: string | undefined;
  ingredients?: DeepPartial<IRecipeIngredient>[] | undefined;
  tags?: Pick<IRecipeTag, "id">[] | undefined;
  newTags?: Pick<IRecipeTag, "name">[] | undefined;
  prepTimeMagnitude?: number | undefined;
  prepTimeUnit?: Time | undefined;
  cookTimeMagnitude?: number | undefined;
  cookTimeUnit?: Time | undefined;
  defaultNumberOfServings?: [number, number] | undefined;
  notes?: string | undefined;
  source?: string | undefined;
}
