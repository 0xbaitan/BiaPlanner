import { ICreateShoppingItemDto, IShoppingItem, IUpdateShoppingItemDto } from "./ShoppingItem";

import { IBaseEntity } from "../BaseEntity";

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
  items?: (ICreateShoppingItemDto | IUpdateShoppingItemDto)[] | undefined;
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
  items?: (ICreateShoppingItemDto | IUpdateShoppingItemDto)[] | undefined;
}
