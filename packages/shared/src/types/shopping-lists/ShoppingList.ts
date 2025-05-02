import { IShoppingItem, WriteShoppingItemExtended, WriteShoppingListItemSchema } from "./ShoppingItem";

import { FilterParamsSchema } from "../PaginateExtended";
import { IBaseEntity } from "../BaseEntity";
import { z } from "zod";

export interface IShoppingList extends IBaseEntity {
  title: string;
  notes?: string;
  plannedDate: string;
  isShoppingComplete?: boolean;
  items?: IShoppingItem[];
}

export const WriteShoppingListSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(1, "Title is required")
    .refine((title) => title.trim().length > 0, "Title cannot be empty")
    .refine((title) => title.length <= 100, "Title cannot exceed 100 characters"),
  notes: z.string().optional().nullable(),
  plannedDate: z.coerce
    .string(
      z
        .string()
        .min(1, "Planned date has to be in the correct format")
        .refine((date) => !isNaN(Date.parse(date)), "Invalid date format")
    )
    .optional(),
  items: z.array(WriteShoppingListItemSchema).min(1, "At least one item is required"),
});

export type IWriteShoppingListDto = z.infer<typeof WriteShoppingListSchema>;

export const MarkShoppingListDoneSchema = WriteShoppingListSchema.extend({
  items: z.array(WriteShoppingItemExtended).min(1, "At least one item is required"),
});

export type IMarkShoppingListDoneDto = z.infer<typeof MarkShoppingListDoneSchema>;

export enum ShoppingListSortBy {
  TITLE_A_TO_Z = "TITLE_A_TO_Z",
  TITLE_Z_TO_A = "TITLE_Z_TO_A",
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
  MOST_URGENT = "MOST_URGENT",
  LEAST_URGENT = "LEAST_URGENT",
}

export const QueryShoppingListDtoSchema = FilterParamsSchema.extend({
  sortBy: z.nativeEnum(ShoppingListSortBy).optional(),
  search: z.string().optional(),
  plannedDate: z.coerce.date().optional(),
});

export type IQueryShoppingListDto = z.infer<typeof QueryShoppingListDtoSchema>;
