import { IBaseEntity } from "../BaseEntity";
import { IProduct } from "./Product";

export interface IProductCategory extends IBaseEntity {
  name: string;
  products?: IProduct[];
}

export interface ICreateProductCategoryDto {
  name: string;
}

export interface IUpdateProductCategoryDto extends Partial<ICreateProductCategoryDto>, Pick<IProductCategory, "id"> {}

export class CreateProductCategoryDto implements ICreateProductCategoryDto {
  name: string;
}

export class UpdateProductCategoryDto implements IUpdateProductCategoryDto {
  id: string;
  name?: string | undefined;
}
