import { IBaseEntity } from "../BaseEntity";
import { IFile } from "../File";
import { IProduct } from "./Product";

export interface IBrand extends IBaseEntity {
  name: string;
  description?: string;
  logo?: IFile;
  logoId?: string;
  products?: IProduct[];
}

export interface ICreateBrandDto {
  name: string;
}

export interface IUpdateBrandDto {
  name?: string;
}
