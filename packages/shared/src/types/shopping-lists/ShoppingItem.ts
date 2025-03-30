import { IBaseEntity } from "../BaseEntity";
import { IShoppingList } from "./ShoppingList";

export interface IShoppingItem extends IBaseEntity {
  productId: string;
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
