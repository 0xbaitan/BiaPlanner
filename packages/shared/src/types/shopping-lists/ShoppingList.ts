import { ICreateShoppingItemDto, ICreateShoppingItemExtendedDto, IShoppingItem, IUpdateShoppingItemDto, IUpdateShoppingItemExtendedDto } from "./ShoppingItem";

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
