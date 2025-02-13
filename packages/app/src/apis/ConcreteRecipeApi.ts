import { IConcreteRecipe, ICreateConcreteRecipeDto } from "@biaplanner/shared";

import { rootApi } from ".";

export const concreteRecipesApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
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

export const { useCreateConcreteRecipeMutation } = concreteRecipesApi;
