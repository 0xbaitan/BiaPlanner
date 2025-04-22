import { IQueryRecipeDto, IRecipe, IWriteRecipeDto } from "@biaplanner/shared";

import { Paginated } from "nestjs-paginate/lib/paginate";
import qs from "qs";
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

    createRecipe: build.mutation<IRecipe, IWriteRecipeDto>({
      query: (body) => ({
        url: "/meal-plan/recipes",
        method: "POST",
        body,
      }),

      invalidatesTags: (result, error) => [{ type: "Recipe", id: "LIST" }, { type: "Cuisine" }, { type: "RecipeTag" }, { type: "RecipeIngredient" }],
    }),

    updateRecipe: build.mutation<
      IRecipe,
      {
        id: string;
        dto: IWriteRecipeDto;
      }
    >({
      query: ({ dto, id }) => ({
        url: `/meal-plan/recipes/${id}`,
        method: "PUT",
        body: dto,
      }),

      invalidatesTags: (_result, _error, { id }) => [{ type: "Recipe", id }, { type: "Recipe", id: "LIST" }, { type: "Cuisine" }, { type: "RecipeTag" }, { type: "RecipeIngredient" }],
    }),

    deleteRecipe: build.mutation<void, string>({
      query: (id) => ({
        url: `/meal-plan/recipes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Recipe", id }, { type: "Recipe", id: "LIST" }, { type: "Cuisine" }, { type: "RecipeTag" }, { type: "RecipeIngredient" }],
    }),

    searchRecipes: build.query<Paginated<IRecipe>, IQueryRecipeDto>({
      query: (query) => ({
        url: `/query/recipes?${qs.stringify(query)}`,
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.data.map((recipe) => ({ id: recipe.id, type: "Recipe" as const })), { type: "Recipe", id: "LIST" }] : [{ type: "Recipe", id: "LIST" }]),
    }),
  }),
});

export const { useGetRecipesQuery, useLazyGetRecipesQuery, useCreateRecipeMutation, useUpdateRecipeMutation, useDeleteRecipeMutation, useGetRecipeQuery, useSearchRecipesQuery, useLazySearchRecipesQuery } = RecipeApi;
