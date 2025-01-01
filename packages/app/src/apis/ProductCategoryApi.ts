import { IProductCategory } from "@biaplanner/shared";
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
  }),
});

export const { useGetProductCategoriesQuery, useLazyGetProductCategoriesQuery } = productClassificationApi;
