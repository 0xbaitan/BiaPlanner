import { IBaseEntity } from "../BaseEntity";
import { IShoppingItem } from "./ShoppingItem";

export interface IShoppingList extends IBaseEntity {
  title: string;
  notes?: string;
  plannedDate: string;
  isShoppingComplete?: boolean;
  items?: IShoppingItem[];
}
