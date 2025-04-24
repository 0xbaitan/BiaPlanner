export * from "./Time";
export * from "./Environment";
export * from "./CookingMeasurementConversion";
export * from "./Validators";
export * from "./Transformers";

import { EnumLike, z } from "zod";
import { IPaginationMeta, Pagination } from "nestjs-typeorm-paginate";

export type Paginated<T, U extends IPaginationMeta = IPaginationMeta> = Pagination<T, U>;

export const FilterParamsSchema = z.object({
  page: z.coerce.number(),
  limit: z.coerce.number().optional(),
  search: z.string().optional(),
});
