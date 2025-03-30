import { IBaseEntity } from "../BaseEntity";

export interface IShoppingList extends IBaseEntity {
  title: string;
  notes?: string;
  plannedDate: string;
  isShoppingComplete?: boolean;
}
