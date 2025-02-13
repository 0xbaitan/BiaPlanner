import { CookingMeasurementType, ICreatePantryItemDto, IPantryItem } from "@biaplanner/shared";

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
    getIngredientCompatiblePantryItems: build.query<IPantryItem[], { ingredientId: string; measurementType: CookingMeasurementType }>({
      query: ({ ingredientId, measurementType }) => ({
        url: `/pantry/items/compatible`,
        method: "GET",
        params: { ingredientId, measurementType },
      }),
      keepUnusedDataFor: 0,
      providesTags: [{ type: "PantryItem", id: "COMPATIBLE" }],
    }),
  }),
});

export const { useGetPantryItemsQuery, useLazyGetPantryItemsQuery, useCreatePantryItemMutation, useGetIngredientCompatiblePantryItemsQuery } = pantryItemsApi;
