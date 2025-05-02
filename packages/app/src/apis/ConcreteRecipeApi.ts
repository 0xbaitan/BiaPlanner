import { IConcreteRecipe, IQueryConcreteRecipeDto, IWriteConcreteRecipeDto } from "@biaplanner/shared";

import { Paginated } from "@biaplanner/shared";
import qs from "qs";
import { rootApi } from ".";

export const concreteRecipesApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getConcreteRecipes: build.query<IConcreteRecipe[], void>({
      query: () => ({
        url: "/meal-plan/concrete-recipes",
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "ConcreteRecipe" as const, id })), { type: "ConcreteRecipe", id: "LIST" }] : [{ type: "ConcreteRecipe", id: "LIST" }]),
    }),
    createConcreteRecipe: build.mutation<IConcreteRecipe, IWriteConcreteRecipeDto>({
      query: (dto) => ({
        url: "/meal-plan/concrete-recipes",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [
        "ConcreteRecipe",
        { type: "ConcreteRecipe", id: "LIST" },
        {
          type: "PantryItem",
          id: "COMPATIBLE",
        },
      ],
    }),

    searchConcreteRecipes: build.query<Paginated<IConcreteRecipe>, IQueryConcreteRecipeDto>({
      query: (query) => ({
        url: `/query/concrete-recipes?${qs.stringify(query, {
          arrayFormat: "brackets",
        })}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "ConcreteRecipe" as const,
                id,
              })),
              { type: "ConcreteRecipe", id: "LIST" },
            ]
          : [{ type: "ConcreteRecipe", id: "LIST" }],
    }),
  }),
});

export const { useCreateConcreteRecipeMutation, useGetConcreteRecipesQuery, useSearchConcreteRecipesQuery, useLazyGetConcreteRecipesQuery } = concreteRecipesApi;
