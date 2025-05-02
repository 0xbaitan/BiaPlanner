import { FileSchema, IFile } from "../File";

import { FilterParamsSchema } from "../PaginateExtended";
import { IBaseEntity } from "../BaseEntity";
import { IProduct } from "./Product";
import { z } from "zod";
import { zfd } from "zod-form-data";

export interface IBrand extends IBaseEntity {
  name: string;
  description?: string;
  logo?: IFile;
  logoId?: string;
  products?: IProduct[];
}

export const WriteBrandDtoSchema = zfd.formData({
  name: z.string().min(1, { message: "Brand name is required" }),
  description: z.string().optional().nullable(),
  file: zfd.file().optional().nullable(),
});

export type IWriteBrandDto = z.infer<typeof WriteBrandDtoSchema>;

export enum BrandSortBy {
  BRAND_NAME_A_TO_Z = "BRAND_NAME_A_TO_Z",
  BRAND_NAME_Z_TO_A = "BRAND_NAME_Z_TO_A",
  DEFAULT = "DEFAULT",

  BRAND_MOST_PRODUCTS = "BRAND_MOST_PRODUCTS",
  BRAND_LEAST_PRODUCTS = "BRAND_LEAST_PRODUCTS",
}

export const QueryBrandDtoSchema = FilterParamsSchema.extend({
  sortBy: z.enum([BrandSortBy.BRAND_NAME_A_TO_Z, BrandSortBy.BRAND_NAME_Z_TO_A, BrandSortBy.BRAND_MOST_PRODUCTS, BrandSortBy.BRAND_LEAST_PRODUCTS, BrandSortBy.DEFAULT]).optional(),
});

export type IQueryBrandDto = z.infer<typeof QueryBrandDtoSchema>;
