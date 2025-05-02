import { IPantryItemPortion, PantryItemPortionSchema, WritePantryItemPortionDtoSchema } from "./PantryItemPortion";

import { CookingMeasurement } from "../CookingMeasurement";
import { IBaseEntity } from "../BaseEntity";
import { IConcreteRecipe } from "./ConcreteRecipe";
import { IPantryItem } from "../pantry";
import { IRecipe } from "./Recipe";
import { IRecipeIngredient } from "./RecipeIngredient";
import { z } from "zod";

export interface IConcreteIngredient extends IBaseEntity {
  concreteRecipeId?: string;
  concreteRecipe?: IConcreteRecipe;
  ingredientId?: string;
  ingredient?: IRecipeIngredient;
  pantryItemsWithPortions?: IPantryItemPortion[];
}

export const ConcreteIngredientAndMeasurementSchema = {
  ingredientId: z.string(),
  pantryItemsWithPortions: z.array(z.object(PantryItemPortionSchema)).optional(),
};

export const WriteConcreteIngredientDtoSchema = z.object({
  concreteRecipeId: z.string().optional().nullable(),
  ingredientId: z.string().min(1, { message: "Ingredient ID is required" }),
  pantryItemsWithPortions: z.array(WritePantryItemPortionDtoSchema).optional(),
  id: z.string().optional(),
});

export type IWriteConcreteIngredientDto = z.infer<typeof WriteConcreteIngredientDtoSchema>;
