import { Paginated as NestjsPaginated } from "nestjs-paginate";
import { z } from "zod";
export const FilterParamsSchema = z.object({
  page: z.coerce.number(),
  limit: z.coerce.number().optional(),
  search: z.string().optional(),
});

export type Paginated<T> = NestjsPaginated<T>;

export type FuzzyQuery = {
  strategy: "trigram" | "soundex";
  searchTerm: string;
  fields: string[];
  scoreThreshold?: number;
};

export function isFuzzyQuery(value: unknown): value is FuzzyQuery {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const keys = Object.keys(value);

  if (!(keys.includes("strategy") && keys.includes("searchTerm") && keys.includes("fields"))) {
    return false;
  }

  const { strategy, searchTerm, fields } = value as FuzzyQuery;

  if (typeof strategy !== "string" || typeof searchTerm !== "string" || !Array.isArray(fields)) {
    return false;
  }

  return true;
}
