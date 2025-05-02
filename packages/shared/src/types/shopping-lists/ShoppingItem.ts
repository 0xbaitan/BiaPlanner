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
