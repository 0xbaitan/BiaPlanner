import { ICreateUserDto, IUpdateUserDto, IUser } from "@biaplanner/shared";

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
    addUser: build.mutation<IUser, ICreateUserDto>({
      query: (dto) => ({
        url: "/users",
        method: "POST",
        body: dto,
      }),

      invalidatesTags: ["User", "PhoneEntry"],
    }),
    updateUser: build.mutation({
      query: ({ id, dto }: { id: string; dto: IUpdateUserDto }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: dto,
      }),

      invalidatesTags: ["User", "PhoneEntry"],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery, useAddUserMutation, useLazyGetUserQuery, useLazyGetUsersQuery, useUpdateUserMutation } = usersApi;
