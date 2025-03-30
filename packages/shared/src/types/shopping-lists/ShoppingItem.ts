import { IBaseEntity } from "../BaseEntity";

export interface IShoppingItem extends IBaseEntity {
  productId: string;
  quantity: number;
  replacementId?: string;
  replacement?: IShoppingItem;
  shoppingListId?: string;
  isReplaced?: boolean;
  isChecked?: boolean;
  isCancelled?: boolean;
}
