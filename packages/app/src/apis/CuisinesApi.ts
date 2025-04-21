import { ICreateCuisineDto, ICuisine, IUpdateCuisineDto } from "@biaplanner/shared";

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

    getCuisine: build.query<ICuisine, string>({
      query: (id) => ({
        url: `/meal-plan/cuisines/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Cuisine", id }],
    }),

    createCuisine: build.mutation<ICuisine, ICreateCuisineDto>({
      query: (dto: ICreateCuisineDto) => ({
        url: "/meal-plan/cuisines",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [{ type: "Cuisine", id: "LIST" }],
    }),

    updateCuisine: build.mutation<ICuisine, IUpdateCuisineDto>({
      query: (dto) => ({
        url: `/meal-plan/cuisines/${dto.id}`,
        method: "PUT",
        body: dto,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Cuisine", id },
        { type: "Cuisine", id: "LIST" },
      ],
    }),

    deleteCuisine: build.mutation<void, string>({
      query: (id) => ({
        url: `/meal-plan/cuisines/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Cuisine", id },
        { type: "Cuisine", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetCuisinesQuery, useLazyGetCuisinesQuery, useGetCuisineQuery, useCreateCuisineMutation, useUpdateCuisineMutation, useDeleteCuisineMutation } = cuisinesApi;
export const useCuisinesPrefetch = () => {
  const prefetch = cuisinesApi.usePrefetch("getCuisines" as const, { force: true, ifOlderThan: 0 });

  return {
    prefetchCuisines: () => {
      prefetch();
    },
  };
};
