import { IBaseEntity } from "../BaseEntity";
import { IProduct } from "./Product";

export interface IProductCategory extends IBaseEntity {
  name: string;
  products?: IProduct[];
}

export interface ICreateProductCategoryDto {
  name: string;
}

export interface IUpdateProductCategoryDto {
  name?: string;
}
