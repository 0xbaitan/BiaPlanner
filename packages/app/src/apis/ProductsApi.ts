import { ICreateProductDto, IProduct, IUpdateProductDto } from "@biaplanner/shared";

import { rootApi } from ".";

export const productsApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<IProduct[], void>({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getProductById: build.query<IProduct, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (result) => (result ? [{ type: "Product", id: result.id }] : []),
    }),

    createProduct: build.mutation<IProduct, ICreateProductDto>({
      query: (dto) => ({
        url: "/products",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: build.mutation<IProduct, { id: string; dto: IUpdateProductDto }>({
      query: ({ id, dto }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: dto,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery, useLazyGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useGetProductByIdQuery, useLazyGetProductByIdQuery } = productsApi;
