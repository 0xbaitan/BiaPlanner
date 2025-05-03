import { Paginated } from "@biaplanner/shared";
export default function calculatePaginationElements<T>(limit: number, paginatedResults: Paginated<T> | undefined) {
  const numItems = paginatedResults?.data.length || 0;
  const currentPage = paginatedResults?.meta.currentPage || 1;
  const totalItems = paginatedResults?.meta.totalItems || 0;
  const searchTermUsed = paginatedResults?.meta.searchTermUsed || undefined;

  const numItemStartOnPage = (currentPage - 1) * limit + 1;
  const numItemEndOnPage = Math.min(currentPage * limit, totalItems);

  const totalPages = paginatedResults?.meta.totalPages || 1;
  const itemsPerPage = paginatedResults?.meta.itemsPerPage || 0;

  return {
    numItems,
    currentPage,
    totalItems,
    searchTermUsed,
    numItemStartOnPage,
    numItemEndOnPage,
    totalPages,
    itemsPerPage,
  };
}
