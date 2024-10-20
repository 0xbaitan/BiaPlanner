import { User } from "@biaplanner/shared";
import { createApi } from "@reduxjs/toolkit/query";
import { rootApi } from ".";

export const usersApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<Promise<User[]>, void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
    }),
    getUser: build.query<Promise<User[]>, number>({
      query: (id: number) => ({
        url: "/users/:id",
        method: "GET",
        params: { id },
      }),
    }),
    addUser: build.query<Promise<User>, User>({
      query: (user: User) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useAddUserQuery,
  useLazyAddUserQuery,
  useLazyGetUserQuery,
  useLazyGetUsersQuery,
} = usersApi;
