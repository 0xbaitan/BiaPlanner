import { ICreateShoppingListDto, IMarkShoppingListDoneDto, IShoppingList, IUpdateShoppingListDto, IUpdateShoppingListExtendedDto, IWriteShoppingListDto, Paginated } from "@biaplanner/shared";
import { IQueryShoppingListFilterParams, IQueryShoppingListResultsDto } from "@biaplanner/shared";

import { rootApi } from ".";

export const shoppingListsApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getShoppingLists: build.query<IShoppingList[], void>({
      query: () => ({
        url: `/shopping-lists`,
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "ShoppingList" as const, id })), { type: "ShoppingList", id: "LIST" }] : [{ type: "ShoppingList", id: "LIST" }]),
    }),

    createShoppingList: build.mutation<IShoppingList, IWriteShoppingListDto>({
      query: (body) => ({
        url: `/shopping-lists`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ShoppingList", id: "LIST" }],
    }),

    updateShoppingList: build.mutation<
      IShoppingList,
      {
        id: string;
        dto: IWriteShoppingListDto;
      }
    >({
      query: ({ id, dto }) => ({
        url: `/shopping-lists/${id}`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "ShoppingList", id: arg.id }],
    }),

    deleteShoppingList: build.mutation<void, string>({
      query: (id) => ({
        url: `/shopping-lists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ShoppingList", id: "LIST" }],
    }),

    getShoppingList: build.query<IShoppingList, string>({
      query: (id) => ({
        url: `/shopping-lists/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "ShoppingList", id: arg }],
    }),

    markShoppingDone: build.mutation<IShoppingList, { id: string; dto: IMarkShoppingListDoneDto }>({
      query: ({ id, dto }) => ({
        url: `/mark-shopping-done/${id}`,
        method: "PUT",
        body: dto,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "ShoppingList", id: arg.id }],
    }),

    searchShoppingLists: build.query<Paginated<IShoppingList>, IQueryShoppingListFilterParams>({
      query: (query) => ({
        url: `/query/shopping-lists`,
        method: "GET",
        params: query,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "ShoppingList" as const,
                id: id,
              })),
              { type: "ShoppingList", id: "LIST" },
            ]
          : [{ type: "ShoppingList", id: "LIST" }],
    }),
  }),
});

export const { useGetShoppingListsQuery, useCreateShoppingListMutation, useUpdateShoppingListMutation, useDeleteShoppingListMutation, useGetShoppingListQuery, useMarkShoppingDoneMutation, useSearchShoppingListsQuery, useLazyGetShoppingListQuery } =
  shoppingListsApi;
