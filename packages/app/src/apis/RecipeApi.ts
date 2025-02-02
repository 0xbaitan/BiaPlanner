import { ICreateRecipeDto, IRecipe, IUpdateRecipeDto } from "@biaplanner/shared";

import { rootApi } from ".";

export const RecipeApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getRecipes: build.query<IRecipe[], void>({
      query: () => ({
        url: "/meal-plan/recipes",
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "Recipe" as const, id })), { type: "Recipe", id: "LIST" }] : [{ type: "Recipe", id: "LIST" }]),
    }),

    getRecipe: build.query<IRecipe, string>({
      query: (id) => ({
        url: `/meal-plan/recipes/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Recipe", id }],
    }),

    createRecipe: build.mutation<IRecipe, ICreateRecipeDto>({
      query: (body) => ({
        url: "/meal-plan/recipes",
        method: "POST",
        body,
      }),

      invalidatesTags: (result, error) => [{ type: "Recipe", id: "LIST" }, { type: "Cuisine" }, { type: "RecipeTag" }],
    }),

    updateRecipe: build.mutation<IRecipe, IUpdateRecipeDto>({
      query: (dto) => ({
        url: `/meal-plan/recipes/${dto.id}`,
        method: "PUT",
        body: dto,
      }),

      invalidatesTags: (result, error, { id }) => [{ type: "Recipe", id }, { type: "Recipe", id: "LIST" }, { type: "Cuisine" }, { type: "RecipeTag" }],
    }),

    deleteRecipe: build.mutation<void, string>({
      query: (id) => ({
        url: `/meal-plan/recipes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Recipe", id }, { type: "Recipe", id: "LIST" }, { type: "Cuisine" }, { type: "RecipeTag" }],
    }),
  }),
});

export const { useGetRecipesQuery, useLazyGetRecipesQuery, useCreateRecipeMutation, useUpdateRecipeMutation, useDeleteRecipeMutation, useGetRecipeQuery } = RecipeApi;
