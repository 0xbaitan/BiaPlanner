import { IPantryItem, IProduct } from "../pantry";

import { IBaseEntity } from "../BaseEntity";
import { IPhoneEntry } from "../PhoneEntry";
import { IRole } from "./Role";

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
  isAdmin?: boolean;
  roles?: IRole[];
}

export interface ICreateUserDto {
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}
export interface IUpdateUserDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  dateOfBirth?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
}

export interface ILoginUserDto {
  login: string;
  password: string;
}
