import { ResultDescription, createApi } from "@reduxjs/toolkit/query";

import { User } from "@biaplanner/shared";
import { rootApi } from ".";

export const usersApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    getUser: build.query<User[], number>({
      query: (id: number) => ({
        url: "/users/:id",
        method: "GET",
        params: { id },
      }),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    addUser: build.mutation<User, User>({
      query: (user: User) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),

      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useAddUserMutation,
  useLazyGetUserQuery,
  useLazyGetUsersQuery,
} = usersApi;
