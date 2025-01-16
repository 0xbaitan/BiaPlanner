import { IBrand, ICreateBrandDto, IUpdateBrandDto } from "@biaplanner/shared";

import { rootApi } from ".";

export const brandsApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getBrands: build.query<IBrand[], void>({
      query: () => ({
        url: "/brands",
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "Brand" as const, id })), { type: "Brand", id: "LIST" }] : [{ type: "Brand", id: "LIST" }]),
    }),

    getBrand: build.query<IBrand, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Brand", id }],
    }),
    createBrand: build.mutation<IBrand, ICreateBrandDto>({
      query: (data) => ({
        url: "/brands",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Brand", id: "LIST" }],
    }),
    updateBrand: build.mutation<IBrand, IUpdateBrandDto>({
      query: ({ id, ...dto }) => ({
        url: `/brands/${id}`,
        method: "PUT",
        body: dto,
      }),
      invalidatesTags: (result, _error, { id }) => [{ type: "Brand", id }],
    }),
  }),
});

export const { useGetBrandsQuery, useLazyGetBrandsQuery, useCreateBrandMutation, useGetBrandQuery, useLazyGetBrandQuery, useUpdateBrandMutation } = brandsApi;
