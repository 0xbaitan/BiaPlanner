import { ICreateShoppingItemDto, ICreateShoppingItemExtendedDto, IShoppingItem, IUpdateShoppingItemDto, IUpdateShoppingItemExtendedDto, WriteShoppingListItemSchema } from "./ShoppingItem";

import { FilterParamsSchema } from "../../util";
import { IBaseEntity } from "../BaseEntity";
import { z } from "zod";

export interface IShoppingList extends IBaseEntity {
  title: string;
  notes?: string;
  plannedDate: string;
  isShoppingComplete?: boolean;
  items?: IShoppingItem[];
}

export interface ICreateShoppingListDto extends Omit<IShoppingList, keyof IBaseEntity | "items"> {
  items?: ICreateShoppingItemDto[];
}

export interface IUpdateShoppingListDto extends Partial<Omit<IShoppingList, keyof IBaseEntity | "items">>, Pick<IShoppingList, "id"> {
  items?: IUpdateShoppingListDto[] | undefined;
}

export interface IUpdateShoppingListExtendedDto extends Partial<Omit<IShoppingList, keyof IBaseEntity | "items">>, Pick<IShoppingList, "id"> {
  items?: IUpdateShoppingItemExtendedDto[] | undefined;
}

export class CreateShoppingListDto implements ICreateShoppingListDto {
  title: string;
  notes?: string;
  plannedDate: string;
  items?: ICreateShoppingItemDto[];
}

export class UpdateShoppingListDto implements IUpdateShoppingListDto {
  id: string;
  title?: string | undefined;
  notes?: string | undefined;
  plannedDate?: string | undefined;
  isShoppingComplete?: boolean | undefined;
  items?: IUpdateShoppingItemDto[] | undefined;
}

export class UpdateShoppingListExtendedDto implements IUpdateShoppingListExtendedDto {
  id: string;
  title?: string | undefined;
  notes?: string | undefined;
  plannedDate?: string | undefined;
  isShoppingComplete?: boolean | undefined;
  items: IUpdateShoppingItemExtendedDto[] | undefined;
}

export const WriteShoppingListSchema = z.object({
  title: z.string().min(1, "Title is required"),
  notes: z.string().optional(),
  plannedDate: z.coerce.date().optional(),
  items: z.array(WriteShoppingListItemSchema).min(1, "At least one item is required"),
});

export type IWriteShoppingListDto = z.infer<typeof WriteShoppingListSchema>;

export enum ShoppingListSortBy {
  TITLE_A_TO_Z = "TITLE_A_TO_Z",
  TITLE_Z_TO_A = "TITLE_Z_TO_A",
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
  MOST_URGENT = "MOST_URGENT",
  LEAST_URGENT = "LEAST_URGENT",
}

export const QueryShoppingListParamsSchema = FilterParamsSchema.extend({
  sortBy: z.nativeEnum(ShoppingListSortBy).optional(),
  search: z.string().optional(),
  plannedDate: z.coerce.date().optional(),
});

export const QueryShoppingListResultsSchema = z.object({
  shoppingListId: z.string(),
  title: z.string(),
  notes: z.string().optional().nullable(),
  plannedDate: z.coerce.date().optional().nullable(),
  isShoppingComplete: z.coerce.boolean().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number(),
      })
    )
    .optional()
    .nullable(),
});

export type IQueryShoppingListResultsDto = z.infer<typeof QueryShoppingListResultsSchema>;

export type IQueryShoppingListFilterParams = z.infer<typeof QueryShoppingListParamsSchema>;
