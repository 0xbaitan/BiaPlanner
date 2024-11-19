import { IBrand, IReadBrandDto } from "@biaplanner/shared";

import { rootApi } from ".";

export const brandsApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getBrands: build.query<IBrand[], IReadBrandDto>({
      query: (dto) => ({
        url: "/brands",
        method: "GET",
        params: dto,
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "Brand" as const, id })), { type: "Brand", id: "LIST" }] : [{ type: "Brand", id: "LIST" }]),
    }),
  }),
});

export const { useGetBrandsQuery, useLazyGetBrandsQuery } = brandsApi;
