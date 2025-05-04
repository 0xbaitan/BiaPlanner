import { CookingMeasurement, CookingMeasurementSchema, CookingMeasurementType } from "../CookingMeasurement";

import { FilterParamsSchema } from "../PaginateExtended";
import { IBaseEntity } from "../BaseEntity";
import { IPantryItemPortion } from "../meal-plans";
import { IProduct } from "./Product";
import { IReminder } from "../reminder";
import { IUser } from "../User";
import exp from "constants";
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
  pantryItemPortions?: IPantryItemPortion[];
}

export interface IPantryItemWithReservationPresent extends IPantryItem {
  reservationPresent?: boolean;
  reservedPortion?: CookingMeasurement;
}

export const WritePantryItemSchema = z.object({
  productId: z.string().min(1, { message: "Product ID is required" }),
  quantity: z.coerce.number().min(0, { message: "Quantity must be greater than 0" }),
  expiryDate: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return date.getTime() > Date.now();
      },
      {
        message: "Expiry date must be in the future",
      }
    )
    .optional(),
});

export type IWritePantryItemDto = z.infer<typeof WritePantryItemSchema>;

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

export enum ExpiredItemsVisibility {
  SHOW_EXPIRED_ONLY = "SHOW_EXPIRED_ONLY",
  SHOW_FRESH_ONLY = "SHOW_FRESH_ONLY",
  SHOW_ALL = "SHOW_ALL",
}

export const QueryPantryItemDtoSchema = FilterParamsSchema.extend({
  search: z.string().optional(),
  sortBy: z.nativeEnum(PantryItemSortBy).optional(),
  expiredItemsVisibility: z.nativeEnum(ExpiredItemsVisibility).default(ExpiredItemsVisibility.SHOW_ALL).optional(),
  showLooseOnly: z.coerce.boolean().optional(),
  brandIds: z.array(z.string()).optional(),
  productCategoryIds: z.array(z.string()).optional(),
  productIds: z.array(z.string()).optional(),
});

export const QueryCompatiblePantryItemDtoSchema = z.object({
  ingredientId: z.string().min(1, {
    message: "ingredient ID required",
  }),
  measurementType: z.nativeEnum(CookingMeasurementType).default(CookingMeasurementType.WEIGHT),
  existingConcreteIngredientId: z.string().optional(),
});

export type IQueryCompatiblePantryItemDto = z.infer<typeof QueryCompatiblePantryItemDtoSchema>;

export type IQueryPantryItemDto = z.infer<typeof QueryPantryItemDtoSchema>;

export const ConsumePantryItemDtoSchema = z.object({
  pantryItemId: z.string().min(1, { message: "Pantry item ID is required" }),
  measurement: z.object(CookingMeasurementSchema).optional(),
});
export type IConsumePantryItemDto = z.infer<typeof ConsumePantryItemDtoSchema>;
