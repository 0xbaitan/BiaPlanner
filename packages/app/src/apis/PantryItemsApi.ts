import { IPantryItem, PhoneEntry } from "@biaplanner/shared";

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
  }),
});

export const { useGetPantryItemsQuery, useLazyGetPantryItemsQuery } = pantryItemsApi;
