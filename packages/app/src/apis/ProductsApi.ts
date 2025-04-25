import { ICreateProductDto, IProduct, IQueryProductParamsDto, IQueryProductResultsDto, IUpdateProductDto, Paginated } from "@biaplanner/shared";

import qs from "qs";
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
      invalidatesTags: ["Product", { type: "Product", id: "LIST" }, "ProductCategory"],
    }),

    updateProduct: build.mutation<IProduct, { id: string; dto: IUpdateProductDto }>({
      query: ({ id, dto }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: dto,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        {
          type: "Product",
          id: "LIST",
        },
        {
          type: "ProductCategory",
          id: "LIST",
        },
        {
          type: "PantryItem",
          id: "LIST",
        },
        {
          type: "RecipeIngredient",
          id: "LIST",
        },
        {
          type: "PantryItem",
        },
      ],
    }),

    searchProducts: build.query<Paginated<IQueryProductResultsDto>, IQueryProductParamsDto>({
      query: (query) => ({
        url: `/query/products?${qs.stringify(query)}`,
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.items.filter(({ id }) => id != null).map(({ id }) => ({ type: "Product" as const, id })), { type: "Product", id: "LIST" }] : [{ type: "Product", id: "LIST" }]),
    }),
  }),
});

export const { useGetProductsQuery, useLazyGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useGetProductByIdQuery, useLazyGetProductByIdQuery, useSearchProductsQuery, useLazySearchProductsQuery } = productsApi;
