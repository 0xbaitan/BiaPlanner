import { Volumes, Weights } from "../units";

import { IBaseEntity } from "../BaseEntity";
import { IBrand } from "./Brand";
import { IPantryItem } from "./PantryItem";
import { IProductCategory } from "./ProductCategory";
import { IUser } from "../User";

export interface IProduct extends IBaseEntity {
  name: string;

  productCategories?: IProductCategory[];
  brand?: IBrand;
  brandId?: string;
  canExpire?: boolean;
  canQuicklyExpireAfterOpening?: boolean;
  millisecondsToExpiryAfterOpening?: number;
  pantryItems?: IPantryItem[];
  createdBy?: IUser;
  createdById?: string;
  isGlobal?: boolean;
  isLoose?: boolean;
  useMeasurementMetric?: "weight" | "volume";
  numberOfServingsOrPieces?: number;
  weightPerContainerOrPacket?: number;
  weightUnit?: Weights;
  volumePerContainerOrPacket?: number;
  volumeUnit?: Volumes;
}

export interface ICreateProductDto
  extends Pick<
    IProduct,
    | "brandId"
    | "canExpire"
    | "canQuicklyExpireAfterOpening"
    | "millisecondsToExpiryAfterOpening"
    | "numberOfServingsOrPieces"
    | "useMeasurementMetric"
    | "volumePerContainerOrPacket"
    | "volumeUnit"
    | "weightPerContainerOrPacket"
    | "weightUnit"
    | "isLoose"
    | "name"
    | "createdById"
  > {
  productCategoryIds?: string[];
}

export interface IUpdateProductDto extends Partial<ICreateProductDto> {}
