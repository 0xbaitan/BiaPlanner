import { ICreateRecipeTagDto, IRecipeTag, IUpdateRecipeTagDto } from "@biaplanner/shared";

import { rootApi } from ".";

const recipeTagsApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getRecipeTags: build.query<IRecipeTag[], void>({
      query: () => ({
        url: "/meal-plan/recipe-tags",
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "RecipeTag" as const, id })), { type: "RecipeTag", id: "LIST" }] : [{ type: "RecipeTag", id: "LIST" }]),
    }),

    getRecipeTag: build.query<IRecipeTag, string>({
      query: (id) => ({
        url: `/meal-plan/recipe-tags/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "RecipeTag", id }],
    }),

    createRecipeTag: build.mutation<void, ICreateRecipeTagDto>({
      query: (dto) => ({
        url: "/meal-plan/recipe-tags",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [{ type: "RecipeTag" as const, id: "LIST" }],
    }),

    updateRecipeTag: build.mutation<void, IUpdateRecipeTagDto>({
      query: (dto) => ({
        url: `/meal-plan/recipe-tags/${dto.id}`,
        method: "PUT",
        body: dto,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "RecipeTag", id },
        { type: "RecipeTag", id: "LIST" },
      ],
    }),

    deleteRecipeTag: build.mutation<void, string>({
      query: (id) => ({
        url: `/meal-plan/recipe-tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "RecipeTag", id },
        { type: "RecipeTag", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetRecipeTagsQuery, useLazyGetRecipeTagsQuery, useGetRecipeTagQuery, useCreateRecipeTagMutation, useUpdateRecipeTagMutation, useDeleteRecipeTagMutation } = recipeTagsApi;
