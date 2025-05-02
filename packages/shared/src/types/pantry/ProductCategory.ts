import { FilterParamsSchema } from "../PaginateExtended";
import { IBaseEntity } from "../BaseEntity";
import { IProduct } from "./Product";
import { IRecipeIngredient } from "../meal-plans";
import { z } from "zod";

export interface IProductCategory extends IBaseEntity {
  name: string;
  products?: IProduct[];
  recipeIngredients?: IRecipeIngredient[];
  isAllergen?: boolean;
}

export interface ICreateProductCategoryDto {
  name: string;
  isAllergen?: boolean;
}

export const WriteProductCategoryDtoSchema = z.object({
  name: z.string().min(1, { message: "Product category name is required" }),
  isAllergen: z.coerce.boolean().optional(),
});

export type IWriteProductCategoryDto = z.infer<typeof WriteProductCategoryDtoSchema>;

export enum ProductCategorySortBy {
  PRODUCT_CATEGORY_NAME_A_TO_Z = "PRODUCT_CATEGORY_NAME_A_TO_Z",
  PRODUCT_CATEGORY_NAME_Z_TO_A = "PRODUCT_CATEGORY_NAME_Z_TO_A",
  PRODUCT_CATEGORY_MOST_PRODUCTS = "PRODUCT_CATEGORY_MOST_PRODUCTS",
  PRODUCT_CATEGORY_LEAST_PRODUCTS = "PRODUCT_CATEGORY_LEAST_PRODUCTS",
  DEFAULT = "DEFAULT",
}

export enum ProductCategoryAllergenFilter {
  SHOW_EVERYTHING = "SHOW_EVERYTHING",
  SHOW_ALLERGENS_ONLY = "SHOW_ALLERGENS_ONLY",
  HIDE_ALLERGENS = "HIDE_ALLERGENS",
}

export const QueryProductCategoryDtoSchema = FilterParamsSchema.extend({
  sortBy: z
    .enum([
      ProductCategorySortBy.PRODUCT_CATEGORY_NAME_A_TO_Z,
      ProductCategorySortBy.PRODUCT_CATEGORY_NAME_Z_TO_A,
      ProductCategorySortBy.PRODUCT_CATEGORY_MOST_PRODUCTS,
      ProductCategorySortBy.PRODUCT_CATEGORY_LEAST_PRODUCTS,
      ProductCategorySortBy.DEFAULT,
    ])
    .optional(),
  allergenVisibility: z.enum([ProductCategoryAllergenFilter.SHOW_EVERYTHING, ProductCategoryAllergenFilter.SHOW_ALLERGENS_ONLY, ProductCategoryAllergenFilter.HIDE_ALLERGENS]).optional(),
});

export type IQueryProductCategoryDto = z.infer<typeof QueryProductCategoryDtoSchema>;
