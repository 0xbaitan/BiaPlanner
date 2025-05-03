import { Paginated } from '@biaplanner/shared';
import { SelectQueryBuilder } from 'typeorm';

export default async function paginate<T, U extends T = T>(
  qb: SelectQueryBuilder<T>,
  page: number = 1,
  limit: number = 25,
  searchTermUsed?: string,

  transformAndUseRaw?: (entities: T[], raw: any[]) => U[],
): Promise<Paginated<U>> {
  if (page < 1) {
    page = 1;
  }

  if (limit < 1) {
    limit = 25;
  }

  qb.skip((page - 1) * limit);
  qb.take(limit);

  const { entities, raw } = await qb.getRawAndEntities();

  const items = transformAndUseRaw
    ? transformAndUseRaw(entities, raw)
    : (entities as unknown as U[]);
  const count = await qb.getCount();
  return {
    data: items,
    meta: {
      totalItems: count,
      itemsPerPage: limit,
      currentPage: page,
      totalPages: Math.max(Math.ceil(count / limit), 1),
      searchTermUsed: searchTermUsed,
      numItemsStartOnPage: (page - 1) * limit + 1,
      numItemsEndOnPage: Math.min(page * limit, count),
    },
  };
}
