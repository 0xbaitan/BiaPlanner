import { IBaseEntity } from "../BaseEntity";
import { IProduct } from "../pantry";
import { IShoppingList } from "./ShoppingList";

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

export interface ICreateShoppingItemDto extends Pick<IShoppingItem, "productId" | "quantity"> {}

export interface IUpdateShoppingItemDto extends Partial<Omit<IShoppingItem, keyof IBaseEntity | "shoppingList" | "replacement" | "replacementId">>, Pick<IShoppingItem, "id"> {
  replacement?: ICreateShoppingItemDto | IUpdateShoppingItemDto | undefined;
}

export class CreateShoppingItemDto implements ICreateShoppingItemDto {
  productId: string;
  quantity: number;
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
