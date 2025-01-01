import { IPantryItem, IProduct } from "./pantry";

import { IBaseEntity } from "./BaseEntity";
import { IPhoneEntry } from "./PhoneEntry";

export interface IUser extends IBaseEntity {
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  email: string;
  password?: string;
  phoneEntries?: IPhoneEntry[];
  pantryItems?: IPantryItem[];
  products?: IProduct[];
}

export interface ICreateUserDto {
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  email: string;
  password: string;
}
export interface IUpdateUserDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  dateOfBirth?: string;
  email?: string;
  password?: string;
}

export interface ILoginUserDto {
  login: string;
  password: string;
}
