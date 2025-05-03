import { IBaseEntity } from "../BaseEntity";
import { IRecipe } from "./Recipe";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export interface IRecipeTag extends IBaseEntity {
  name: string;
  description?: string;
  recipes?: IRecipe[];
}

export interface IRecipeTagExtended extends IRecipeTag {
  recipeCount: number;
}

export const WriteRecipeTagDtoSchema = z.object({
  name: z.string().min(1, { message: "Recipe tag name is required" }),
  description: z.string().optional().nullable(),
});

export type IWriteRecipeTagDto = z.infer<typeof WriteRecipeTagDtoSchema>;

export enum RecipeTagSortBy {
  RECIPE_TAG_NAME_A_TO_Z = "RECIPE_TAG_NAME_A_TO_Z",
  RECIPE_TAG_NAME_Z_TO_A = "RECIPE_TAG_NAME_Z_TO_A",
  RECIPE_TAG_MOST_RECIPES = "RECIPE_TAG_MOST_RECIPES",
  RECIPE_TAG_LEAST_RECIPES = "RECIPE_TAG_LEAST_RECIPES",
  DEFAULT = "DEFAULT",
}

const RecipeTagSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
});

export const QueryRecipeTagSchema = z.object({
  page: z.coerce.number(),
  limit: z.coerce.number().optional(),
  search: z.string().optional(),
  sortBy: z.enum([RecipeTagSortBy.RECIPE_TAG_NAME_A_TO_Z, RecipeTagSortBy.RECIPE_TAG_NAME_Z_TO_A, RecipeTagSortBy.RECIPE_TAG_MOST_RECIPES, RecipeTagSortBy.RECIPE_TAG_LEAST_RECIPES, RecipeTagSortBy.DEFAULT]).optional(),
});

export type IQueryRecipeTagDto = z.infer<typeof QueryRecipeTagSchema>;
export class QueryRecipeTagDto extends createZodDto(QueryRecipeTagSchema) {}
