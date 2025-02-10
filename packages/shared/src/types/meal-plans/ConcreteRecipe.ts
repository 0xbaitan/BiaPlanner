import { IConcreteIngredient, ICreateConcreteIngredientDto } from "./ConcreteIngredient";

import { DeepPartial } from "utility-types";
import { IBaseEntity } from "../BaseEntity";
import { IPantryItem } from "../pantry";
import { IRecipe } from "./Recipe";
import { MealTypes } from "../units";

export interface IConcreteRecipe extends IBaseEntity {
  recipeId: string;
  recipe: IRecipe;
  planDate?: string;
  numberOfServings?: [number, number];
  confirmedIngredients: IConcreteIngredient[];
  mealType: MealTypes;
}

export interface ICreateConcreteRecipeDto extends Omit<IConcreteRecipe, keyof IBaseEntity | "recipe" | "confirmedIngredients"> {
  confirmedIngredients: ICreateConcreteIngredientDto[];
}

export interface IUpdateConcreteRecipeDto extends Partial<ICreateConcreteRecipeDto>, Pick<IConcreteRecipe, "id"> {}

export class CreateConcreteRecipeDto implements ICreateConcreteRecipeDto {
  confirmedIngredients: ICreateConcreteIngredientDto[];
  recipeId: string;
  planDate?: string;
  numberOfServings?: [number, number];
  mealType: MealTypes;
}

export class UpdateConcreteRecipeDto implements IUpdateConcreteRecipeDto {
  confirmedIngredients: ICreateConcreteIngredientDto[];
  recipeId: string;
  planDate?: string;
  numberOfServings?: [number, number];
  mealType: MealTypes;
  id: string;
}
