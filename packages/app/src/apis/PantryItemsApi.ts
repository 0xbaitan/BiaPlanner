import { ICreatePantryItemDto, IPantryItem } from "@biaplanner/shared";

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
    createPantryItem: build.mutation<IPantryItem, ICreatePantryItemDto>({
      query: (dto) => ({
        url: "/pantry/items",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [{ type: "PantryItem" as const, id: "LIST" }],
    }),
    getIngredientCompatiblePantryItems: build.query<IPantryItem[], { ingredientId: string }>({
      query: ({ ingredientId }) => ({
        url: `/pantry/items/ingredient-compatible/${ingredientId}`,
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "PantryItem" as const, id })), { type: "PantryItem" as const, id: "LIST" }] : [{ type: "PantryItem" as const, id: "LIST" }]),
    }),
  }),
});

export const { useGetPantryItemsQuery, useLazyGetPantryItemsQuery, useCreatePantryItemMutation, useGetIngredientCompatiblePantryItemsQuery } = pantryItemsApi;
