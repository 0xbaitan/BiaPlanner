import { FuzzyQuery, PaginateQuery } from "@biaplanner/shared";

export default function createPaginateQueryString(paginatedQuery: Partial<Omit<PaginateQuery, "path">>, fuzzyQuery?: FuzzyQuery) {
  const queryString = new URLSearchParams();

  // Add pagination parameters
  if (paginatedQuery.page) {
    queryString.append("page", paginatedQuery.page.toString());
  }
  if (paginatedQuery.limit) {
    queryString.append("limit", paginatedQuery.limit.toString());
  }
  if (paginatedQuery.cursor) {
    queryString.append("cursor", paginatedQuery.cursor);
  }
  if (paginatedQuery.cursorColumn) {
    queryString.append("cursorColumn", paginatedQuery.cursorColumn);
  }
  if (paginatedQuery.cursorDirection) {
    queryString.append("cursorDirection", paginatedQuery.cursorDirection);
  }

  // Add search parameters
  if (paginatedQuery.search) {
    queryString.append("search", paginatedQuery.search);
  }

  // Add filter parameters
  if (paginatedQuery.filter) {
    for (const [key, value] of Object.entries(paginatedQuery.filter)) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          queryString.append(`filter.${key}`, v);
        });
      } else {
        queryString.append(`filter.${key}`, value);
      }
    }
  }

  // Add sort parameters
  if (paginatedQuery.sortBy) {
    paginatedQuery.sortBy.forEach(([key, value]) => {
      queryString.append("sortBy", `${key}:${value}`);
    });
  }

  // Add select parameters
  if (paginatedQuery.select) {
    paginatedQuery.select.forEach((select) => {
      queryString.append("select", select);
    });
  }

  const qs = queryString.toString();
  console.log("qs", qs);
  return qs;
}
