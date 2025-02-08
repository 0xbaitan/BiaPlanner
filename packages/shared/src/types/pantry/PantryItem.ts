import { CookingMeasurement } from "../CookingMeasurement";
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
  totalMeasurements?: CookingMeasurement;
  availableMeasurements?: CookingMeasurement;
  consumedMeasurements?: CookingMeasurement;
  reservedMeasurements?: CookingMeasurement;
}

export interface IPantryItemExtended extends IPantryItem {
  totalMeasurements?: CookingMeasurement;
  availableMeasurements?: CookingMeasurement;
  consumedMeasurements?: CookingMeasurement;
}

export interface ICreatePantryItemDto {
  productId: string;
  quantity: number;
  expiryDate?: string;
  bestBeforeDate?: string;
  openedDate?: string;
  manufacturedDate?: string;
  totalMeasurements?: CookingMeasurement;
}

export interface IUpdatePantryItemDto {
  quantity?: number;
  expiryDate?: string;
  bestBeforeDate?: string;
  openedDate?: string;
  manufacturedDate?: string;
  isExpired?: boolean;
  totalMeasurements?: CookingMeasurement;
}

export class CreatePantryItemDto implements ICreatePantryItemDto {
  productId: string;
  quantity: number;
  expiryDate?: string;
  bestBeforeDate?: string;
  openedDate?: string;
  manufacturedDate?: string;
  totalMeasurements?: CookingMeasurement | undefined;
}

export class UpdatePantryItemDto implements IUpdatePantryItemDto {
  quantity?: number;
  expiryDate?: string;
  bestBeforeDate?: string;
  openedDate?: string;
  manufacturedDate?: string;
  isExpired?: boolean;
  totalMeasurements?: CookingMeasurement | undefined;
}
