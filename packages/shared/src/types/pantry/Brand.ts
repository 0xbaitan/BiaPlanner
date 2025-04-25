import { FilterParamsSchema } from "../../util";
import { IBaseEntity } from "../BaseEntity";
import { IFile } from "../File";
import { IProduct } from "./Product";
import { z } from "zod";

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

export enum BrandSortBy {
  BRAND_NAME_A_TO_Z = "BRAND_NAME_A_TO_Z",
  BRAND_NAME_Z_TO_A = "BRAND_NAME_Z_TO_A",
  DEFAULT = "DEFAULT",

  BRAND_MOST_PRODUCTS = "BRAND_MOST_PRODUCTS",
  BRAND_LEAST_PRODUCTS = "BRAND_LEAST_PRODUCTS",
}

export const QueryBrandParamsSchema = FilterParamsSchema.extend({
  sortBy: z.enum([BrandSortBy.BRAND_NAME_A_TO_Z, BrandSortBy.BRAND_NAME_Z_TO_A, BrandSortBy.BRAND_MOST_PRODUCTS, BrandSortBy.BRAND_LEAST_PRODUCTS, BrandSortBy.DEFAULT]).optional(),
});

export type IQueryBrandParamsDto = z.infer<typeof QueryBrandParamsSchema>;

export const QueryBrandResultsSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  logoId: z.string().optional().nullable(),
  productCount: z.coerce.number().optional(),
});

export type IQueryBrandResultsDto = z.infer<typeof QueryBrandResultsSchema>;
