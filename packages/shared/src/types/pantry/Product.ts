import { Volumes, Weights } from "../units";

import { CookingMeasurement } from "../CookingMeasurement";
import { IBaseEntity } from "../BaseEntity";
import { IBrand } from "./Brand";
import { IPantryItem } from "./PantryItem";
import { IProductCategory } from "./ProductCategory";
import { IUser } from "../User";
import { TimeMeasurement } from "../TimeMeasurement";

export interface IProduct extends IBaseEntity {
  name: string;

  productCategories?: IProductCategory[];
  brand?: IBrand;
  brandId?: string;
  canExpire?: boolean;
  canQuicklyExpireAfterOpening?: boolean;
  timeTillExpiryAfterOpening?: TimeMeasurement;
  pantryItems?: IPantryItem[];
  createdBy?: IUser;
  createdById?: string;
  isGlobal?: boolean;
  isLoose?: boolean;
  measurement: CookingMeasurement;
}

export interface ICreateProductDto extends Pick<IProduct, "brandId" | "canExpire" | "canQuicklyExpireAfterOpening" | "timeTillExpiryAfterOpening" | "isLoose" | "name" | "createdById" | "measurement"> {
  productCategories: Pick<IProductCategory, "id">[];
}

export interface IUpdateProductDto extends Partial<ICreateProductDto> {}

export class CreateProductDto implements ICreateProductDto {
  brandId: string;
  canExpire: boolean;
  canQuicklyExpireAfterOpening: boolean;
  timeTillExpiryAfterOpening: TimeMeasurement;
  isLoose: boolean;
  name: string;
  createdById: string;
  measurement: CookingMeasurement;
  productCategories: Pick<IProductCategory, "id">[];
}

export class UpdateProductDto implements IUpdateProductDto {
  brandId?: string;
  canExpire?: boolean;
  canQuicklyExpireAfterOpening?: boolean;
  timeTillExpiryAfterOpening?: TimeMeasurement;
  isLoose?: boolean;
  name?: string;
  measurement: CookingMeasurement;
  productCategories?: Pick<IProductCategory, "id">[];
}
