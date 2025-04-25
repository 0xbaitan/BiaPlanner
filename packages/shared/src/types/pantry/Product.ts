import { CookingMeasurement, CookingMeasurementType } from "../CookingMeasurement";
import { Volumes, Weights } from "../units";

import { FilterParamsSchema } from "../../util";
import { IBaseEntity } from "../BaseEntity";
import { IBrand } from "./Brand";
import { IFile } from "../File";
import { IPantryItem } from "./PantryItem";
import { IProductCategory } from "./ProductCategory";
import { IShoppingItem } from "../shopping-lists";
import { IUser } from "../User";
import { TimeMeasurement } from "../TimeMeasurement";
import { z } from "zod";

export interface IProduct extends IBaseEntity {
  name: string;
  description?: string;
  productCategories?: IProductCategory[];
  brand?: IBrand;
  brandId?: string;
  canExpire?: boolean;
  canQuicklyExpireAfterOpening?: boolean;
  timeTillExpiryAfterOpening?: TimeMeasurement;
  pantryItems?: IPantryItem[];
  createdBy?: IUser;
  createdById?: string;
  isGlobal?: boolean;
  isLoose?: boolean;
  measurement: CookingMeasurement;
  measurementType?: CookingMeasurementType;
  coverId?: string;
  cover?: IFile;
  shoppingItems?: IShoppingItem[];
}

export interface ICreateProductDto extends Pick<IProduct, "brandId" | "canExpire" | "canQuicklyExpireAfterOpening" | "timeTillExpiryAfterOpening" | "isLoose" | "name" | "createdById" | "measurement" | "description" | "coverId"> {
  productCategories: Pick<IProductCategory, "id">[];
}

export interface IUpdateProductDto extends Partial<ICreateProductDto> {}

export class CreateProductDto implements ICreateProductDto {
  brandId: string;
  canExpire: boolean;
  canQuicklyExpireAfterOpening: boolean;
  timeTillExpiryAfterOpening: TimeMeasurement;
  isLoose: boolean;
  name: string;
  createdById: string;
  measurement: CookingMeasurement;
  productCategories: Pick<IProductCategory, "id">[];
  description?: string | undefined;
}

export class UpdateProductDto implements IUpdateProductDto {
  brandId?: string;
  canExpire?: boolean;
  canQuicklyExpireAfterOpening?: boolean;
  timeTillExpiryAfterOpening?: TimeMeasurement;
  isLoose?: boolean;
  name?: string;
  measurement: CookingMeasurement;
  productCategories?: Pick<IProductCategory, "id">[];
  description?: string | undefined;
}

export enum ProductSortBy {
  PRODUCT_NAME_A_TO_Z = "PRODUCT_NAME_A_TO_Z",
  PRODUCT_NAME_Z_TO_A = "PRODUCT_NAME_Z_TO_A",
  PRODUCT_MOST_PANTRY_ITEMS = "PRODUCT_MOST_PANTRY_ITEMS",
  PRODUCT_LEAST_PANTRY_ITEMS = "PRODUCT_LEAST_PANTRY_ITEMS",
  PRODUCT_MOST_SHOPPING_ITEMS = "PRODUCT_MOST_SHOPPING_ITEMS",
  PRODUCT_LEAST_SHOPPING_ITEMS = "PRODUCT_LEAST_SHOPPING_ITEMS",
  DEFAULT = "DEFAULT",
}

export const QueryProductParamsSchema = FilterParamsSchema.extend({
  sortBy: z
    .enum([
      ProductSortBy.PRODUCT_NAME_A_TO_Z,
      ProductSortBy.PRODUCT_NAME_Z_TO_A,
      ProductSortBy.PRODUCT_MOST_PANTRY_ITEMS,
      ProductSortBy.PRODUCT_LEAST_PANTRY_ITEMS,
      ProductSortBy.PRODUCT_MOST_SHOPPING_ITEMS,
      ProductSortBy.PRODUCT_LEAST_SHOPPING_ITEMS,
      ProductSortBy.DEFAULT,
    ])
    .optional(),
  isLoose: z.boolean().optional(),
  brandIds: z.array(z.string()).optional(),
  productCategoryIds: z.array(z.string()).optional(),
  isNonExpirable: z.boolean().optional(),
});

export type IQueryProductParamsDto = z.infer<typeof QueryProductParamsSchema>;

export const QueryProductResultsSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  brandId: z.string(),
  brandName: z.string(),
  productCategoryIds: z.array(z.string()).optional(),
  productCategoryNames: z.array(z.string()).optional(),
  coverImagePath: z.string().optional().nullable(),
  measurementType: z.nativeEnum(CookingMeasurementType).optional(),
  measurement: z.object({
    type: z.nativeEnum(CookingMeasurementType),
    value: z.union([z.number(), z.object({ value: z.number(), unit: z.nativeEnum(Weights) }), z.object({ value: z.number(), unit: z.nativeEnum(Volumes) })]),
  }),
});

export type IQueryProductResultsDto = z.infer<typeof QueryProductResultsSchema>;
