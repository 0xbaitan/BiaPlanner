import { FilterParamsSchema } from "../../util";
import { IBaseEntity } from "../BaseEntity";
import { IRecipe } from "./Recipe";
import { z } from "zod";

export interface ICuisine extends IBaseEntity {
  name: string;
  description?: string;
  recipes?: IRecipe[];
}

export interface ICreateCuisineDto extends Pick<ICuisine, "name" | "description"> {}

export interface IUpdateCuisineDto extends Partial<ICreateCuisineDto>, Pick<ICuisine, "id"> {}

export class CreateCuisineDto implements ICreateCuisineDto {
  name: string;
  description?: string;
}

export class UpdateCuisineDto implements IUpdateCuisineDto {
  id: string;
  name?: string;
  description?: string;
}

export enum CuisineSortBy {
  CUISINE_NAME_A_TO_Z = "CUISINE_NAME_A_TO_Z",
  CUISINE_NAME_Z_TO_A = "CUISINE_NAME_Z_TO_A",
  CUISINE_MOST_RECIPES = "CUISINE_MOST_RECIPES",
  CUISINE_LEAST_RECIPES = "CUISINE_LEAST_RECIPES",
  DEFAULT = "DEFAULT",
}

export const QueryCuisineParamsSchema = FilterParamsSchema.extend({
  sortBy: z.enum([CuisineSortBy.CUISINE_NAME_A_TO_Z, CuisineSortBy.CUISINE_NAME_Z_TO_A, CuisineSortBy.CUISINE_MOST_RECIPES, CuisineSortBy.CUISINE_LEAST_RECIPES, CuisineSortBy.DEFAULT]).optional(),
});

export type IQueryCuisineParamsDto = z.infer<typeof QueryCuisineParamsSchema>;

export const QueryCuisineResultsSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  recipeCount: z.coerce.number().optional(),
});

export type IQueryCuisineResultsDto = z.infer<typeof QueryCuisineResultsSchema>;
