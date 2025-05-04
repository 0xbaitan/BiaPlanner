import { IRecipeIngredient } from "@biaplanner/shared";
import { rootApi } from ".";

export type GetRecipeIngredientsParms = {
  recipeId?: string;
};

export const RecipeIngredientApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getRecipeIngredient: build.query<IRecipeIngredient, string>({
      query: (id: string) => ({
        url: `/meal-plan/recipe-ingredients/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => (result ? [{ type: "RecipeIngredient", id }] : [{ type: "RecipeIngredient", id }]),
    }),
    getRecipeIngredients: build.query<IRecipeIngredient[], GetRecipeIngredientsParms>({
      query: (params: GetRecipeIngredientsParms) => ({
        url: `/meal-plan/recipe-ingredients`,
        method: "GET",
        params: { ...params },
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "RecipeIngredient" as const, id })), { type: "RecipeIngredient", id: "LIST" }] : [{ type: "Recipe", id: "LIST" }]),
    }),
  }),
});

export const { useGetRecipeIngredientsQuery, useGetRecipeIngredientQuery } = RecipeIngredientApi;
