import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { StoreState } from "@/store";

export const rootApi = createApi({
  reducerPath: "root",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000",
    prepareHeaders: (headers, { getState }) => {
      const accessToken = (getState() as StoreState).authentication.accessTokenObject?.accessToken;
      if (accessToken) {
        headers.set("authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),

  endpoints: () => ({}),
  tagTypes: ["User", "PhoneEntry", "PantryItem", "Product", "ProductCategory", "Brand", "Reminder", "Cuisine", "Recipe", "RecipeTag", "RecipeIngredient", "ConcreteRecipe", "ShoppingList"],
});

export default rootApi.reducer;
