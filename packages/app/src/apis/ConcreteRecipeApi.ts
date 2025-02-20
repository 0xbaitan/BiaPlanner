import { IConcreteRecipe, ICreateConcreteRecipeDto } from "@biaplanner/shared";

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
    createConcreteRecipe: build.mutation<IConcreteRecipe, ICreateConcreteRecipeDto>({
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
  }),
});

export const { useCreateConcreteRecipeMutation, useGetConcreteRecipesQuery } = concreteRecipesApi;
