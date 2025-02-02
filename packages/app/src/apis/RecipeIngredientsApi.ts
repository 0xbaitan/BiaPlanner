import { IRecipeIngredient } from "@biaplanner/shared";
import { rootApi } from ".";

export type GetRecipeIngredientsParms = {
  recipeId?: string;
};

export const RecipeApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
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

export const { useGetRecipeIngredientsQuery } = RecipeApi;
