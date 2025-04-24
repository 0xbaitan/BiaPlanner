import { Paginated as PaginateType } from "@biaplanner/shared";
import { Paginated } from "nestjs-paginate/lib/paginate";
export default function calculatePaginationElements(limit: number, paginatedResults: Paginated<any> | undefined) {
  const numItems = paginatedResults?.data.length || 0;
  const currentPage = paginatedResults?.meta.currentPage || 1;
  const totalItems = paginatedResults?.meta.totalItems || 0;
  const searchTermUsed = paginatedResults?.meta.search || undefined;

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

export function calculatePaginationMeta<T>(limit: number, results: PaginateType<T> | undefined) {
  const currentPage = results?.meta.currentPage || 1;
  const totalItems = results?.meta.totalItems || 0;
  const totalPages = results?.meta.totalPages || 1;

  const itemsPerPage = results?.meta.itemsPerPage || limit;
  const numItemStartOnPage = (currentPage - 1) * itemsPerPage + 1;
  const numItemEndOnPage = Math.min(currentPage * itemsPerPage, totalItems);
  const searchTermUsed = results?.meta.search || undefined;
  const numItems = results?.items.length || 0;
  const isLastPage = currentPage === totalPages;
  const isFirstPage = currentPage === 1;
  const isEmpty = totalItems === 0;

  return {
    numItems,
    currentPage,
    totalItems,
    searchTermUsed,
    numItemStartOnPage,
    numItemEndOnPage,
    totalPages,
    itemsPerPage,
    isLastPage,
    isFirstPage,
    isEmpty,
  };
}
