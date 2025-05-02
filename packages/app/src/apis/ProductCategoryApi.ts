import { ICreateProductCategoryDto, IProductCategory, IQueryProductCategoryDto, IWriteProductCategoryDto, Paginated } from "@biaplanner/shared";

import qs from "qs";
import { rootApi } from ".";

export const productCategoriesApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getProductCategories: build.query<IProductCategory[], void>({
      query: () => ({
        url: "/product-categories",
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "ProductCategory" as const, id })), { type: "ProductCategory", id: "LIST" }] : [{ type: "ProductCategory", id: "LIST" }]),
    }),

    getProductCategory: build.query<IProductCategory, string>({
      query: (id) => ({
        url: `/product-categories/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ProductCategory", id }],
    }),

    createProductCategory: build.mutation<IProductCategory, ICreateProductCategoryDto>({
      query: (dto: ICreateProductCategoryDto) => ({
        url: "/product-categories",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [{ type: "ProductCategory", id: "LIST" }],
    }),

    updateProductCategory: build.mutation<IProductCategory, { id: string; dto: IWriteProductCategoryDto }>({
      query: ({ id, dto }) => ({
        url: `/product-categories/${id}`,
        method: "PUT",
        body: dto,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ProductCategory", id },
        { type: "ProductCategory", id: "LIST" },
      ],
    }),

    deleteProductCategory: build.mutation<void, string>({
      query: (id) => ({
        url: `/product-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ProductCategory", id },
        { type: "ProductCategory", id: "LIST" },
      ],
    }),

    getAllergens: build.query<IProductCategory[], void>({
      query: () => ({
        url: "query/product-categories/allergens",
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "ProductCategory" as const, id })), { type: "ProductCategory", id: "LIST" }] : [{ type: "ProductCategory", id: "LIST" }]),
    }),

    searchProductCategories: build.query<Paginated<IProductCategory>, IQueryProductCategoryDto>({
      query: (query) => ({
        url: `/query/product-categories?${qs.stringify(query)}`,
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.data.filter(({ id }) => id != null).map(({ id }) => ({ type: "ProductCategory" as const, id })), { type: "ProductCategory", id: "LIST" }] : [{ type: "ProductCategory", id: "LIST" }]),
    }),
  }),
});

export const {
  useGetProductCategoriesQuery,
  useLazyGetProductCategoriesQuery,
  useGetProductCategoryQuery,
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
  useGetAllergensQuery,
  useLazyGetAllergensQuery,
  useSearchProductCategoriesQuery,
  useLazySearchProductCategoriesQuery,
} = productCategoriesApi;

export const useProductCategoriesPrefetch = () => {
  const prefetch = productCategoriesApi.usePrefetch("getProductCategories" as const, { force: true, ifOlderThan: 0 });

  return {
    prefetchProductCategories: () => {
      prefetch();
    },
  };
};
