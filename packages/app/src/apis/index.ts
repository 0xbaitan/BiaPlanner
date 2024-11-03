import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const rootApi = createApi({
  reducerPath: "root",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/", credentials: "same-origin" }),

  endpoints: () => ({}),
  tagTypes: ["User", "PhoneEntry"],
});

export default rootApi.reducer;
