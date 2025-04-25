import { CookingMeasurement } from "../CookingMeasurement";
import { FilterParamsSchema } from "../../util";
import { IBaseEntity } from "../BaseEntity";
import { IProduct } from "./Product";
import { IReminder } from "../reminder";
import { IUser } from "../User";
import { z } from "zod";

export interface IPantryItem extends IBaseEntity {
  createdBy?: IUser;
  createdById?: string;
  product?: IProduct;
  productId?: string;
  quantity: number;
  expiryDate?: string;
  bestBeforeDate?: string;
  openedDate?: string;
  manufacturedDate?: string;
  isExpired?: boolean;
  reminders?: IReminder[];
  totalMeasurements?: CookingMeasurement;
  availableMeasurements?: CookingMeasurement;
  consumedMeasurements?: CookingMeasurement;
  reservedMeasurements?: CookingMeasurement;
}

export interface IPantryItemExtended extends IPantryItem {
  totalMeasurements?: CookingMeasurement;
  availableMeasurements?: CookingMeasurement;
  consumedMeasurements?: CookingMeasurement;
}

export interface ICreatePantryItemDto {
  productId: string;
  quantity: number;
  expiryDate?: string;
  bestBeforeDate?: string;
  openedDate?: string;
  manufacturedDate?: string;
  totalMeasurements?: CookingMeasurement;
}

export interface IUpdatePantryItemDto {
  quantity?: number;
  expiryDate?: string;
  bestBeforeDate?: string;
  openedDate?: string;
  manufacturedDate?: string;
  isExpired?: boolean;
  totalMeasurements?: CookingMeasurement;
}

export class CreatePantryItemDto implements ICreatePantryItemDto {
  productId: string;
  quantity: number;
  expiryDate?: string;
  bestBeforeDate?: string;
  openedDate?: string;
  manufacturedDate?: string;
  totalMeasurements?: CookingMeasurement | undefined;
}

export class UpdatePantryItemDto implements IUpdatePantryItemDto {
  quantity?: number;
  expiryDate?: string;
  bestBeforeDate?: string;
  openedDate?: string;
  manufacturedDate?: string;
  isExpired?: boolean;
  totalMeasurements?: CookingMeasurement | undefined;
}

export const PantryItemSchema = {
  productId: z.string().optional(),
  quantity: z.number().min(0, { message: "Quantity must be greater than 0" }),
  expiryDate: z.string().optional(),
  bestBeforeDate: z.string().optional(),
  openedDate: z.string().optional(),
  manufacturedDate: z.string().optional(),
  isExpired: z.boolean().optional(),
};

export enum PantryItemSortBy {
  PRODUCT_NAME_A_TO_Z = "PRODUCT_NAME_A_TO_Z",
  PRODUCT_NAME_Z_TO_A = "PRODUCT_NAME_Z_TO_A",
  NEAREST_TO_EXPIRY = "NEAREST_TO_EXPIRY",
  FURTHEST_FROM_EXPIRY = "FURTHEST_FROM_EXPIRY",
  MOST_CONSUMED = "MOST_CONSUMED",
  LEAST_CONSUMED = "LEAST_CONSUMED",
  HIGHEST_QUANTITY = "HIGHEST_QUANTITY",
  LOWEST_QUANTITY = "LOWEST_QUANTITY",
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
}

export const QueryPantryItemParamsSchema = FilterParamsSchema.extend({
  search: z.string().optional(),
  sortBy: z.nativeEnum(PantryItemSortBy).optional(),
  isExpired: z.coerce.boolean().optional(),
  isNonExpirable: z.coerce.boolean().optional(),
  isLoose: z.coerce.boolean().optional(),
  brandIds: z.array(z.string()).optional(),
  productCategoryIds: z.array(z.string()).optional(),
  productIds: z.array(z.string()).optional(),
});

export type IQueryPantryItemFilterParams = z.infer<typeof QueryPantryItemParamsSchema>;
