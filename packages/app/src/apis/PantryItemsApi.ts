import { CookingMeasurementType, IPantryItem, IQueryPantryItemFilterParams, IWritePantryItemDto, Paginated } from "@biaplanner/shared";

import qs from "qs";
import { rootApi } from ".";

export const pantryItemsApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getPantryItems: build.query<IPantryItem[], { userId?: number }>({
      query: ({ userId }) => ({
        url: "/pantry/items",
        method: "GET",
        params: { userId },
      }),

      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "PantryItem" as const, id })), { type: "PantryItem" as const, id: "LIST" }] : [{ type: "PantryItem" as const, id: "LIST" }]),
    }),

    getPantryItemsByIds: build.query<IPantryItem[], { pantryItemIds: string[] }>({
      query: ({ pantryItemIds }) => ({
        url: "/pantry/items/group",
        method: "GET",
        params: { pantryItemIds },
      }),
      providesTags: (result) => (result ? result.map(({ id }) => ({ type: "PantryItem" as const, id })) : []),
    }),

    createPantryItem: build.mutation<IPantryItem, IWritePantryItemDto>({
      query: (dto) => ({
        url: "/pantry/items",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [{ type: "PantryItem" as const, id: "LIST" }],
    }),
    getIngredientCompatiblePantryItems: build.query<IPantryItem[], { ingredientId: string; measurementType: CookingMeasurementType }>({
      query: ({ ingredientId, measurementType }) => ({
        url: `/pantry/items/compatible`,
        method: "GET",
        params: { ingredientId, measurementType },
      }),
      keepUnusedDataFor: 0,
      providesTags: [{ type: "PantryItem", id: "COMPATIBLE" }],
    }),

    getExpiringPantryItems: build.query<IPantryItem[], { maxDaysLeft: number }>({
      query: ({ maxDaysLeft }) => ({
        url: `/pantry/shelf-life/expiring-items`,
        method: "GET",
        params: { maxDaysLeft },
      }),
      providesTags: (result) => (result ? result.map(({ id }) => ({ type: "PantryItem" as const, id })) : []),
    }),

    getExpiredPantryItems: build.query<IPantryItem[], void>({
      query: () => ({
        url: `/pantry/shelf-life/expired-items`,
        method: "GET",
      }),
      providesTags: (result) => (result ? result.map(({ id }) => ({ type: "PantryItem" as const, id })) : []),
    }),

    searchPantryItems: build.query<Paginated<IPantryItem>, IQueryPantryItemFilterParams>({
      query: (query) => ({
        url: `/query/pantry-items?${qs.stringify(query, {
          arrayFormat: "brackets",
        })}`,

        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "PantryItem" as const,
                id,
              })),
              { type: "PantryItem", id: "LIST" },
            ]
          : [{ type: "PantryItem", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPantryItemsQuery,
  useLazyGetPantryItemsQuery,
  useCreatePantryItemMutation,
  useGetIngredientCompatiblePantryItemsQuery,
  useLazyGetIngredientCompatiblePantryItemsQuery,
  useGetPantryItemsByIdsQuery,
  useLazyGetPantryItemsByIdsQuery,
  useGetExpiringPantryItemsQuery,
  useLazyGetExpiringPantryItemsQuery,
  useGetExpiredPantryItemsQuery,
  useLazyGetExpiredPantryItemsQuery,
  useSearchPantryItemsQuery,
  useLazySearchPantryItemsQuery,
} = pantryItemsApi;
