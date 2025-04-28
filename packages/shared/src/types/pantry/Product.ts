import { CookingMeasurement, CookingMeasurementSchema, CookingMeasurementType } from "../CookingMeasurement";
import { Time, Volumes, Weights } from "../units";

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
import { zfd } from "zod-form-data";

export interface IProduct extends IBaseEntity {
  name: string;
  description?: string;
  productCategories?: IProductCategory[];
  brand?: IBrand;
  brandId?: string;
  canExpire?: boolean;
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

export enum ProductSortBy {
  PRODUCT_NAME_A_TO_Z = "PRODUCT_NAME_A_TO_Z",
  PRODUCT_NAME_Z_TO_A = "PRODUCT_NAME_Z_TO_A",
  PRODUCT_MOST_PANTRY_ITEMS = "PRODUCT_MOST_PANTRY_ITEMS",
  PRODUCT_LEAST_PANTRY_ITEMS = "PRODUCT_LEAST_PANTRY_ITEMS",
  PRODUCT_MOST_SHOPPING_ITEMS = "PRODUCT_MOST_SHOPPING_ITEMS",
  PRODUCT_LEAST_SHOPPING_ITEMS = "PRODUCT_LEAST_SHOPPING_ITEMS",
  DEFAULT = "DEFAULT",
}

export const WriteProductDtoSchema = zfd.formData({
  name: z.string().min(1, "Product name is required"),

  description: z.string().optional().nullable(),
  brandId: z.string().min(1, "Brand is required"),
  productCategoryIds: z.array(z.string()).min(1, "At least one product category is required"),
  canExpire: z.coerce.boolean().optional(),
  isGlobal: z.boolean().optional(),
  isLoose: z.boolean().optional(),
  measurement: z.object(CookingMeasurementSchema).optional().nullable(),
  coverId: z.string().optional(),
  file: zfd.file(z.instanceof(File).optional()),
});
export type IWriteProductDto = z.infer<typeof WriteProductDtoSchema>;

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
  isLoose: z.coerce.boolean().optional(),
  brandIds: z.array(z.string()).optional(),
  productCategoryIds: z.array(z.string()).optional(),
  isNonExpirable: z.coerce.boolean().optional(),
});

export type IQueryProductParamsDto = z.infer<typeof QueryProductParamsSchema>;

export const QueryProductResultsSchema = z.object({
  productId: z.string(),
  productName: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  brandId: z.string(),
  brandName: z.string(),
  productCategoryIds: z.array(z.string()).optional(),
  productCategoryNames: z.array(z.string()).optional(),
  coverImagePath: z.string().optional().nullable(),
  measurementType: z.nativeEnum(CookingMeasurementType).optional(),
  measurement: z.object(CookingMeasurementSchema).optional(),
});

export type IQueryProductResultsDto = z.infer<typeof QueryProductResultsSchema>;
