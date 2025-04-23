import { CookingMeasurement, CookingMeasurementSchema } from "../CookingMeasurement";
import { IBaseEntity, ReadEntityDtoSchema } from "../BaseEntity";

import { IProductCategory } from "../pantry";
import { IRecipe } from "./Recipe";
import { z } from "zod";

export interface IRecipeIngredient extends IBaseEntity {
  title?: string;
  productCategories: IProductCategory[];
  measurement?: CookingMeasurement;
  recipeId?: string;
  recipe?: IRecipe;
}

export const WriteRecipeIngredientDtoSchema = z.object({
  title: z.coerce.string().min(1, { message: "Ingredient title is required" }),
  productCategories: z.array(ReadEntityDtoSchema).min(1, {
    message: "Ingredient must map to at least one product category",
  }),
  measurement: z.object(CookingMeasurementSchema).passthrough(),
  recipeId: z.coerce.string().optional(),
  id: z.coerce.string().optional(),
});
export type IWriteRecipeIngredientDto = z.infer<typeof WriteRecipeIngredientDtoSchema>;

export type WriteRecipeIngredientErrors = z.inferFormattedError<typeof WriteRecipeIngredientDtoSchema>;
