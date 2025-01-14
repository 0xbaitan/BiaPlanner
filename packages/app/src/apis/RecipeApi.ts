import { ICreateRecipeDto, IRecipe } from "@biaplanner/shared";

import { rootApi } from ".";

export const RecipeApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getRecipes: build.query<IRecipe[], void>({
      query: () => ({
        url: "/meal-plan/recipes",
        method: "GET",
      }),
      providesTags: ["Recipe"],
    }),

    createRecipe: build.mutation<IRecipe, ICreateRecipeDto>({
      query: (body) => ({
        url: "/meal-plan/recipes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Recipe", "Cuisine", "RecipeTag"],
    }),
  }),
});

export const { useGetRecipesQuery, useLazyGetRecipesQuery, useCreateRecipeMutation } = RecipeApi;
