import { IProduct, IQueryProductDto } from "@biaplanner/shared";

import { Paginated } from "nestjs-paginate/lib/paginate";
import qs from "qs";
import { rootApi } from ".";

export const productsApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<IProduct[], void>({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "Product" as const, id })), { type: "Product", id: "LIST" }] : [{ type: "Product", id: "LIST" }]),
    }),

    getProductById: build.query<IProduct, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),

    createProduct: build.mutation<IProduct, FormData>({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product", { type: "Product", id: "LIST" }, "ProductCategory"],
    }),

    updateProduct: build.mutation<IProduct, { id: string; dto: FormData }>({
      query: ({ id, dto }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: dto,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
        { type: "ProductCategory", id: "LIST" },
        { type: "PantryItem", id: "LIST" },
        { type: "RecipeIngredient", id: "LIST" },
        { type: "PantryItem" },
      ],
    }),

    deleteProduct: build.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    searchProducts: build.query<Paginated<IProduct>, IQueryProductDto>({
      query: (query) => ({
        url: `/query/products?${qs.stringify(query)}`,
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.data?.filter(({ id }) => id != null).map(({ id }) => ({ type: "Product" as const, id })), { type: "Product", id: "LIST" }] : [{ type: "Product", id: "LIST" }]),
    }),

    // getTopBrandedProducts: build.query<IProduct[], IQueryTopBrandedProductsParamsDto>({
    //   query: (query) => ({
    //     url: `/query/products/top-branded?${qs.stringify(query)}`,
    //     method: "GET",
    //   }),
    //   providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "Product" as const, id })), { type: "Product", id: "LIST" }] : [{ type: "Product", id: "LIST" }]),
    // }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  // useGetTopBrandedProductsQuery,
  // useLazyGetTopBrandedProductsQuery,
  useDeleteProductMutation,
} = productsApi;
