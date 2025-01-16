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

export interface ICreateBrandDto extends Pick<IBrand, "name" | "logoId" | "description"> {}

export interface IUpdateBrandDto extends Partial<ICreateBrandDto>, Pick<IBrand, "id"> {}

export class CreateBrandDto implements ICreateBrandDto {
  name: string;
  logoId?: string;
  description?: string;
}

export class UpdateBrandDto implements IUpdateBrandDto {
  id: string;
  name?: string;
  logoId?: string;
  description?: string;
}
