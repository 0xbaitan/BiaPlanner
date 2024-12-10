import { CreateProductDto, IProduct, ReadProductDto } from "@biaplanner/shared";

import { rootApi } from ".";

export const productsApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<IProduct[], ReadProductDto>({
      query: (params: ReadProductDto) => ({
        url: "/products",
        method: "GET",
        params,
      }),
      providesTags: ["Product"],
    }),

    createProduct: build.mutation<IProduct, CreateProductDto>({
      query: (dto) => ({
        url: "/products",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: build.mutation<IProduct, { id: number; dto: CreateProductDto }>({
      query: ({ id, dto }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: dto,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery, useLazyGetProductsQuery, useCreateProductMutation, useUpdateProductMutation } = productsApi;
