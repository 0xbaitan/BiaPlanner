import { IBaseEntity } from "../BaseEntity";
import { IProduct } from "./Product";

export interface IBrand extends IBaseEntity {
  name: string;
  products?: IProduct[];
}

export interface ICreateBrandDto {
  name: string;
}

export interface IUpdateBrandDto {
  name?: string;
}
