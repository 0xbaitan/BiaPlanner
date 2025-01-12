import { ICuisine } from "@biaplanner/shared";
import { rootApi } from ".";

export const cuisinesApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getCuisines: build.query<ICuisine[], void>({
      query: () => ({
        url: "/meal-plan/cuisines",
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "Cuisine" as const, id })), { type: "Cuisine", id: "LIST" }] : [{ type: "Cuisine", id: "LIST" }]),
    }),
  }),
});

export const { useGetCuisinesQuery, useLazyGetCuisinesQuery } = cuisinesApi;
