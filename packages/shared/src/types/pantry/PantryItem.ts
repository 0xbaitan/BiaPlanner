import { IBaseEntity } from "../BaseEntity";
import { IProduct } from "./Product";
import { IReminder } from "../reminder";
import { IUser } from "../User";

export interface IPantryItem extends IBaseEntity {
  createdBy?: IUser;
  createdById?: string;
  product?: IProduct;
  productId?: string;
  quantity: number;
  expiryDate?: string;
  bestBeforeDate?: string;
  openedDate?: string;
  manufacturedDate?: string;
  isExpired?: boolean;
  reminders?: IReminder[];
}

export interface ICreatePantryItemDto {
  productId: string;
  quantity: number;
  expiryDate?: string;
  bestBeforeDate?: string;
  openedDate?: string;
  manufacturedDate?: string;
}

export interface IUpdatePantryItemDto {
  quantity?: number;
  expiryDate?: string;
  bestBeforeDate?: string;
  openedDate?: string;
  manufacturedDate?: string;
  isExpired?: boolean;
}

export class CreatePantryItemDto implements ICreatePantryItemDto {
  productId: string;
  quantity: number;
  expiryDate?: string;
  bestBeforeDate?: string;
  openedDate?: string;
  manufacturedDate?: string;
}

export class UpdatePantryItemDto implements IUpdatePantryItemDto {
  quantity?: number;
  expiryDate?: string;
  bestBeforeDate?: string;
  openedDate?: string;
  manufacturedDate?: string;
  isExpired?: boolean;
}
