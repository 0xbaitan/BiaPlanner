import { ICreateProductCategoryDto, IProductCategory } from "@biaplanner/shared";

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
    createProductCategory: build.mutation<IProductCategory, ICreateProductCategoryDto>({
      query: (data) => ({
        url: "/product-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ProductCategory"],
    }),
  }),
});

export const { useGetProductCategoriesQuery, useLazyGetProductCategoriesQuery, useCreateProductCategoryMutation } = productClassificationApi;
