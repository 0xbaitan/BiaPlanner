import { ICreateProductCategoryDto, IProductCategory, IUpdateProductCategoryDto, PaginateQuery } from "@biaplanner/shared";

import { DeepPartial } from "utility-types";
import { Paginated } from "nestjs-paginate/lib/paginate";
import { rootApi } from ".";

const productClassificationApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getProductCategories: build.query<IProductCategory[], void>({
      query: () => ({
        url: "/product-categories",
        method: "GET",
      }),
      providesTags: ["ProductCategory"],
    }),
    getProductCategory: build.query<IProductCategory, string>({
      query: (id) => ({
        url: `/product-categories/${id}`,
        method: "GET",
      }),
      providesTags: (result, _error, id) => [{ type: "ProductCategory", id }, "ProductCategory"],
    }),

    createProductCategory: build.mutation<IProductCategory, ICreateProductCategoryDto>({
      query: (data) => ({
        url: "/product-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ProductCategory"],
    }),
    updateProductCategory: build.mutation<IProductCategory, IUpdateProductCategoryDto>({
      query: ({ id, ...dto }) => ({
        url: `/product-categories/${id}`,
        method: "PUT",
        body: dto,
      }),
      invalidatesTags: (result, _error, { id }) => ["ProductCategory", { type: "ProductCategory", id }],
    }),
    deleteProductCategory: build.mutation<void, string>({
      query: (id) => ({
        url: `/product-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductCategory", { type: "ProductCategory", id: "LIST" }],
    }),

    searchProductCategories: build.query<Paginated<DeepPartial<IProductCategory>>, Omit<PaginateQuery, "path">>({
      query: (query) => ({
        url: "/query/product-categories",
        method: "GET",
        params: query,
      }),
      providesTags: (result) => {
        const tags = result?.data.map((item) => ({ type: "ProductCategory" as const, id: item.id })) || [];
        return [...tags, { type: "ProductCategory" as const, id: "LIST" }];
      },
    }),

    getAllergens: build.query<IProductCategory[], void>({
      query: () => ({
        url: "/query/product-categories/allergens",
        method: "GET",
      }),
      providesTags: (result) => {
        const tags = result?.map((item) => ({ type: "ProductCategory" as const, id: item.id })) || [];
        return [...tags, { type: "ProductCategory" as const, id: "LIST" }];
      },
    }),
  }),
});

export const {
  useGetProductCategoriesQuery,
  useGetProductCategoryQuery,
  useLazyGetProductCategoryQuery,
  useLazyGetProductCategoriesQuery,
  useCreateProductCategoryMutation,
  useDeleteProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useSearchProductCategoriesQuery,
  useLazySearchProductCategoriesQuery,
  useGetAllergensQuery,
  useLazyGetAllergensQuery,
} = productClassificationApi;
