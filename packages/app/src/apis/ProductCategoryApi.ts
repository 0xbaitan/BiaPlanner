import { IProductCategory, ReadProductCategoryDto } from "@biaplanner/shared";

import { rootApi } from ".";

const productClassificationApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getProductCategories: build.query<IProductCategory[], ReadProductCategoryDto>({
      query: (params: ReadProductCategoryDto) => ({
        url: "/product-categories",
        method: "GET",
        params,
      }),
      providesTags: ["ProductCategory"],
    }),
  }),
});

export const { useGetProductCategoriesQuery, useLazyGetProductCategoriesQuery } = productClassificationApi;
