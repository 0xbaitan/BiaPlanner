import { IProductClassification, ReadProductClassificationDto } from "@biaplanner/shared";

import { rootApi } from ".";

const productClassificationApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getProductClassifications: build.query<IProductClassification[], ReadProductClassificationDto>({
      query: (params: ReadProductClassificationDto) => ({
        url: "/product-classifications",
        method: "GET",
        params,
      }),
      providesTags: ["ProductClassification"],
    }),
  }),
});

export const { useGetProductClassificationsQuery, useLazyGetProductClassificationsQuery } = productClassificationApi;
