import { IProduct, ReadProductDto } from "@biaplanner/shared";

import { rootApi } from ".";

export const productsApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<IProduct[], ReadProductDto>({
      query: (params?: ReadProductDto) => ({
        url: "/products",
        method: "GET",
        params,
      }),
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery, useLazyGetProductsQuery } = productsApi;
