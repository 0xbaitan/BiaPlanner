import { FilterParamsSchema } from "../PaginateExtended";
import { IBaseEntity } from "../BaseEntity";
import { IRecipe } from "./Recipe";
import { z } from "zod";

export interface ICuisine extends IBaseEntity {
  name: string;
  description?: string;
  recipes?: IRecipe[];
}

export interface ICuisineExtended extends ICuisine {
  recipeCount: number;
}

export const WriteCuisineDtoSchema = z.object({
  name: z.string().min(1, { message: "Cuisine name is required" }),
  description: z.string().optional().nullable(),
});

export type IWriteCuisineDto = z.infer<typeof WriteCuisineDtoSchema>;

export enum CuisineSortBy {
  CUISINE_NAME_A_TO_Z = "CUISINE_NAME_A_TO_Z",
  CUISINE_NAME_Z_TO_A = "CUISINE_NAME_Z_TO_A",
  CUISINE_MOST_RECIPES = "CUISINE_MOST_RECIPES",
  CUISINE_LEAST_RECIPES = "CUISINE_LEAST_RECIPES",
  DEFAULT = "DEFAULT",
}

export const QueryCuisineDtoSchema = FilterParamsSchema.extend({
  sortBy: z.enum([CuisineSortBy.CUISINE_NAME_A_TO_Z, CuisineSortBy.CUISINE_NAME_Z_TO_A, CuisineSortBy.CUISINE_MOST_RECIPES, CuisineSortBy.CUISINE_LEAST_RECIPES, CuisineSortBy.DEFAULT]).optional(),
});

export type IQueryCuisineDto = z.infer<typeof QueryCuisineDtoSchema>;
