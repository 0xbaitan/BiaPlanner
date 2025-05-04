import { ConcreteIngredientAndMeasurementSchema, IConcreteIngredient, WriteConcreteIngredientDtoSchema } from "./ConcreteIngredient";

import { DeepPartial } from "utility-types";
import { FilterParamsSchema } from "../PaginateExtended";
import { IBaseEntity } from "../BaseEntity";
import { IPantryItem } from "../pantry";
import { IRecipe } from "./Recipe";
import { MealTypes } from "../units";
import dayjs from "dayjs";
import { z } from "zod";

export interface IConcreteRecipe extends IBaseEntity {
  recipeId: string;
  recipe: IRecipe;
  planDate?: string;
  numberOfServings?: [number, number];
  confirmedIngredients: IConcreteIngredient[];
  mealType: MealTypes;
  isSufficient?: boolean;
  isCooked?: boolean;
}

export enum ConcreteRecipeSortBy {
  RECIPE_TITLE_A_TO_Z = "RECIPE_TITLE_A_TO_Z",
  RECIPE_TITLE_Z_TO_A = "RECIPE_TITLE_Z_TO_A",
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
  MOST_UREGENT = "MOST_URGENT",
  LEAST_URGENT = "LEAST_URGENT",
}

export const WriteConcreteRecipeDtoSchema = z.object({
  recipeId: z.string().min(1, { message: "Recipe ID is required" }),
  numberOfServings: z
    .tuple([z.number().min(1), z.number().min(1)])
    .optional()
    .nullable(),
  mealType: z.nativeEnum(MealTypes),
  confirmedIngredients: z.array(WriteConcreteIngredientDtoSchema).optional().nullable(),
  planDate: z.coerce
    .string()
    .refine(
      (val) => {
        const day = dayjs(val);
        return day.isValid() && day.diff(dayjs(), "day") >= 0;
      },
      {
        message: "Plan date must be a valid date and cannot be in the past",
      }
    )
    .default(() => dayjs().format("YYYY-MM-DD")),
});

export const QueryConcreteRecipeDtoSchema = FilterParamsSchema.extend({
  mealType: z.array(z.enum([MealTypes.BREAKFAST, MealTypes.LUNCH, MealTypes.DINNER])).optional(),
  sortBy: z.nativeEnum(ConcreteRecipeSortBy).optional(),
});

export type IQueryConcreteRecipeDto = z.infer<typeof QueryConcreteRecipeDtoSchema>;

export type IWriteConcreteRecipeDto = z.infer<typeof WriteConcreteRecipeDtoSchema>;
