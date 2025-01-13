import { IRecipeTag } from "@biaplanner/shared";
import { rootApi } from ".";

const recipeTagsApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getRecipeTags: build.query<IRecipeTag[], void>({
      query: () => ({
        url: "/meal-plan/recipe-tags",
        method: "GET",
      }),
      providesTags: ["RecipeTag"],
    }),
  }),
});

export const { useGetRecipeTagsQuery, useLazyGetRecipeTagsQuery } = recipeTagsApi;
