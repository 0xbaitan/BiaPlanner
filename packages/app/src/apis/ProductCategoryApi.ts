import { ICreateProductCategoryDto, IProductCategory, IUpdateProductCategoryDto } from "@biaplanner/shared";

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
  }),
});

export const { useGetProductCategoriesQuery, useGetProductCategoryQuery, useLazyGetProductCategoryQuery, useLazyGetProductCategoriesQuery, useCreateProductCategoryMutation, useDeleteProductCategoryMutation, useUpdateProductCategoryMutation } =
  productClassificationApi;
