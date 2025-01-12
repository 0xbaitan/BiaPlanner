import { DifficultyLevels, Time } from "../units";

import { IBaseEntity } from "../BaseEntity";
import { ICuisine } from "./Cuisine";
import { IRecipeIngredient } from "./RecipeIngredient";
import { IRecipeTag } from "./RecipeTag";

export interface IRecipe extends IBaseEntity {
  title: string;
  description?: string;
  instructions: string[];
  ingredients: IRecipeIngredient[];
  difficultyLevel: DifficultyLevels;
  cuisineId: string;
  cuisine: ICuisine;
  prepTimeMagnitude: number;
  prepTimeUnit: Time;
  cookTimeMagnitude: number;
  cookTimeUnit: Time;
  defaultNumberOfServings: [number, number | null];

  notes?: string;
  source?: string;
  tags?: IRecipeTag[];
}
