import { IBrand } from "@biaplanner/shared";
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
  }),
});

export const { useGetBrandsQuery, useLazyGetBrandsQuery } = brandsApi;
