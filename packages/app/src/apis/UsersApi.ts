import { ResultDescription, createApi } from "@reduxjs/toolkit/query";

import { IUser } from "@biaplanner/shared";
import { rootApi } from ".";

export const usersApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<IUser[], void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "User" as const, id })), { type: "User", id: "LIST" }] : [{ type: "User", id: "LIST" }]),
    }),
    getUser: build.query<IUser, number>({
      query: (id: number) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    addUser: build.mutation<IUser, IUser>({
      query: (user: IUser) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),

      invalidatesTags: ["User", "PhoneEntry"],
    }),
    updateUser: build.mutation({
      query: ({ id, user }: { id: number; user: Partial<IUser> }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: user,
      }),

      invalidatesTags: ["User", "PhoneEntry"],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery, useAddUserMutation, useLazyGetUserQuery, useLazyGetUsersQuery, useUpdateUserMutation } = usersApi;
