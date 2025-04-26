import { IBaseEntity } from "../BaseEntity";
import { IProduct } from "../pantry";
import { IShoppingList } from "./ShoppingList";
import { z } from "zod";

export interface IShoppingItem extends IBaseEntity {
  productId: string;
  product?: IProduct;
  quantity: number;
  replacementId?: string;
  replacement?: IShoppingItem;
  shoppingListId?: string;
  shoppingList?: IShoppingList;
  isReplaced?: boolean;
  isChecked?: boolean;
  isExtra?: boolean;
  isCancelled?: boolean;
}

export const WriteShoppingListItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().int().positive("Quantity is required"),
  replacementId: z.string().optional().nullable(),
  shoppingListId: z.string().optional(),
  isReplaced: z.coerce.boolean().optional(),
  isChecked: z.coerce.boolean().optional(),
  isExtra: z.coerce.boolean().optional(),
  isCancelled: z.coerce.boolean().optional(),
});

export const WriteShoppingItemWithExpiry = WriteShoppingListItemSchema.extend({
  expiryDate: z.coerce
    .string()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    })
    .optional(),
});

export const WriteShoppingItemExtended = WriteShoppingItemWithExpiry.extend({
  replacement: WriteShoppingItemWithExpiry.optional(),
});

export type IWriteShoppingItemDto = z.infer<typeof WriteShoppingListItemSchema>;
export type IWriteShoppingItemExtendedDto = z.infer<typeof WriteShoppingItemExtended>;
export type IWriteShoppingItemWithExpiryDto = z.infer<typeof WriteShoppingItemWithExpiry>;

export interface ICreateShoppingItemDto extends Pick<IShoppingItem, "productId" | "quantity"> {}

export interface IUpdateShoppingItemDto extends Partial<Omit<IShoppingItem, keyof IBaseEntity | "shoppingList" | "replacement" | "replacementId">>, Pick<IShoppingItem, "id"> {
  replacement?: ICreateShoppingItemDto | IUpdateShoppingItemDto | undefined;
}

export interface IShoppingItemExtended extends Omit<IShoppingItem, keyof IBaseEntity | "replacement"> {
  id?: string;
  replacement?: IShoppingItemExtended;
  expiryDate?: string;
}

export interface ICreateShoppingItemExtendedDto extends ICreateShoppingItemDto, Pick<IShoppingItemExtended, "expiryDate"> {}

export interface IUpdateShoppingItemExtendedDto extends Partial<Omit<IShoppingItemExtended, "product" | "replacementId" | "replacement">> {
  replacement?: ICreateShoppingItemExtendedDto;
  id?: string;
}

export class CreateShoppingItemDto implements ICreateShoppingItemDto {
  productId: string;
  quantity: number;
}

export class UpdateShoppingItemExtendedDto implements IUpdateShoppingItemExtendedDto {
  id?: string;
  productId?: string | undefined;
  quantity?: number | undefined;
  replacementId?: string | undefined;
  shoppingListId?: string | undefined;
  isCancelled?: boolean | undefined;
  isChecked?: boolean | undefined;
  isExtra?: boolean | undefined;
  isReplaced?: boolean | undefined;
  replacement?: IShoppingItemExtended | undefined;
  expiryDate?: string | undefined;
}

export class CreateShoppingItemExtendedDto implements ICreateShoppingItemExtendedDto {
  productId: string;
  quantity: number;
  expiryDate?: string | undefined;
}

export class UpdateShoppingItemDto implements IUpdateShoppingItemDto {
  id: string;
  productId?: string | undefined;
  quantity?: number | undefined;
  replacementId?: string | undefined;
  shoppingListId?: string | undefined;
  isCancelled?: boolean | undefined;
  isChecked?: boolean | undefined;
  isExtra?: boolean | undefined;
  isReplaced?: boolean | undefined;
  replacement?: ICreateShoppingItemDto | IUpdateShoppingItemDto | undefined;
}
