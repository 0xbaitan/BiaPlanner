import { IQueryRoleDto, IRole, IWriteRoleDto, Paginated } from "@biaplanner/shared";

import qs from "qs";
import { rootApi } from ".";

export const rolesApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getRole: build.query<IRole, string>({
      query: (id) => ({
        url: `/user-info/roles/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Role", id }],
    }),

    getRoles: build.query<IRole[], void>({
      query: () => ({
        url: "/user-info/roles",
        method: "GET",
      }),
      providesTags: (result) => (result ? [...result.map(({ id }) => ({ type: "Role" as const, id })), { type: "Role", id: "LIST" }] : [{ type: "Role", id: "LIST" }]),
    }),

    createRole: build.mutation<IRole, IWriteRoleDto>({
      query: (dto) => ({
        url: "/user-info/roles",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),

    updateRole: build.mutation<IRole, { id: string; dto: IWriteRoleDto }>({
      query: ({ id, dto }) => ({
        url: `/user-info/roles/${id}`,
        method: "PUT",
        body: dto,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Role", id },
        { type: "Role", id: "LIST" },
      ],
    }),

    deleteRole: build.mutation<void, string>({
      query: (id) => ({
        url: `/user-info/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Role", id },
        { type: "Role", id: "LIST" },
      ],
    }),

    searchRoles: build.query<Paginated<IRole>, IQueryRoleDto>({
      query: (query) => ({
        url: `/query/roles?${qs.stringify(query, {
          arrayFormat: "brackets",
        })}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Role" as const,
                id,
              })),
              { type: "Role", id: "LIST" },
            ]
          : [{ type: "Role", id: "LIST" }],
    }),

    getCurrentAuthenticatedUserRoles: build.query<IRole[], void>({
      query: () => ({
        url: "/user-info/roles?currentUser=true",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Role" as const,
                id,
              })),
              { type: "Role", id: "LIST" },
            ]
          : [{ type: "Role", id: "LIST" }],
    }),
  }),
});

export const { useGetRoleQuery, useGetRolesQuery, useCreateRoleMutation, useUpdateRoleMutation, useDeleteRoleMutation, useSearchRolesQuery, useGetCurrentAuthenticatedUserRolesQuery } = rolesApi;
