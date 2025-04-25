import { ConcreteIngredientAndMeasurementSchema, IConcreteIngredient, ICreateConcreteIngredientDto } from "./ConcreteIngredient";
import { IPantryItem, PantryItemSchema } from "../pantry";

import { DeepPartial } from "utility-types";
import { FilterParamsSchema } from "../../util";
import { IBaseEntity } from "../BaseEntity";
import { IRecipe } from "./Recipe";
import { MealTypes } from "../units";
import { z } from "zod";

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

export enum ConcreteRecipeSortBy {
  RECIPE_TITLE_A_TO_Z = "RECIPE_TITLE_A_TO_Z",
  RECIPE_TITLE_Z_TO_A = "RECIPE_TITLE_Z_TO_A",
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
  MOST_UREGENT = "MOST_URGENT",
  LEAST_URGENT = "LEAST_URGENT",
}

export const QueryConcreteRecipeParamsSchema = FilterParamsSchema.extend({
  mealType: z.array(z.enum([MealTypes.BREAKFAST, MealTypes.LUNCH, MealTypes.DINNER])).optional(),
  sortBy: z.nativeEnum(ConcreteRecipeSortBy).optional(),
});

export const QueryConcreteRecipeResultsSchema = z.object({
  concreteRecipeId: z.string(),
  recipeId: z.coerce.string(),
  recipeTitle: z.string(),
  daysTillPlanDate: z.coerce.number().optional(),
  mealType: z.nativeEnum(MealTypes).optional().nullable(),
  planDate: z.coerce.date().optional().nullable(),
  numberOfServings: z.tuple([z.number(), z.number()]).optional().nullable(),
});

export type IQueryConcreteRecipeResultsDto = z.infer<typeof QueryConcreteRecipeResultsSchema>;

export type IQueryConcreteRecipeFilterParams = z.infer<typeof QueryConcreteRecipeParamsSchema>;
