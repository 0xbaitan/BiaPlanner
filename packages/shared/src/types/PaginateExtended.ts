export type PaginateQuery = {
  page?: number;
  limit?: number;
  sortBy?: [string, string][];
  searchBy?: string[];
  search?: string;
  filter?: {
    [column: string]: string | string[];
  };
  select?: string[];
  cursor?: string;
  cursorColumn?: string;
  cursorDirection?: "before" | "after";
  path: string;
};

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
