import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rootApi = createApi({
  reducerPath: "root",
  baseQuery: fetchBaseQuery({ baseUrl: "http://server:3000" }),
  endpoints: () => ({}),
});
