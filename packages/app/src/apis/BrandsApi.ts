import { IBrand, IBrandExtended, IQueryBrandDto, Paginated } from "@biaplanner/shared";

import qs from "qs";
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
    createBrand: build.mutation<IBrand, FormData>({
      query: (dto) => ({
        url: "/brands",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [{ type: "Brand", id: "LIST" }],
    }),
    updateBrand: build.mutation<IBrand, { id: string; dto: FormData }>({
      query: ({ id, dto }) => ({
        url: `/brands/${id}`,
        method: "PUT",
        body: dto,
      }),

      invalidatesTags: (_result, _error, { id }) => [{ type: "Brand", id }],
    }),
    deleteBrand: build.mutation<void, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, _error, id) => [
        { type: "Brand", id },
        { type: "Brand", id: "LIST" },
      ],
    }),

    // New searchBrands query
    searchBrands: build.query<Paginated<IBrandExtended>, IQueryBrandDto>({
      query: (query) => ({
        url: `/query/brands?${qs.stringify(query)}`,
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.data.filter(({ id }) => id != null).map(({ id }) => ({ type: "Brand" as const, id })), { type: "Brand", id: "LIST" }] : [{ type: "Brand", id: "LIST" }]),
    }),
  }),
});

export const { useGetBrandsQuery, useLazyGetBrandsQuery, useCreateBrandMutation, useGetBrandQuery, useLazyGetBrandQuery, useUpdateBrandMutation, useDeleteBrandMutation, useSearchBrandsQuery, useLazySearchBrandsQuery } = brandsApi;
