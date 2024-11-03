import { IAccessJWTObject, ICreateRequestUserDto, ILoginRequestUserDto, IRefreshJWTObject, ISanitisedUser } from "@biaplanner/shared";

import { rootApi } from ".";

export const authenticationApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    registerUser: build.mutation<ISanitisedUser, ICreateRequestUserDto>({
      query: (dto) => ({
        url: `/auth/register`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["User", "PhoneEntry"],
    }),

    loginUser: build.mutation<{ accessTokenObj: IAccessJWTObject; refreshTokenObj: IRefreshJWTObject }, ILoginRequestUserDto>({
      query: (dto) => ({
        url: `/auth/login`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["User", "PhoneEntry"],
    }),

    logoutUser: build.mutation<void, void>({
      query: () => ({
        url: `/auth/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User", "PhoneEntry"],
    }),

    refreshToken: build.mutation({
      query: (refreshTokenObj?: IRefreshJWTObject) => ({
        url: `/auth/refresh`,
        method: "POST",
        body: refreshTokenObj ?? {},
      }),
      invalidatesTags: ["User", "PhoneEntry"],
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useRefreshTokenMutation, useLogoutUserMutation } = authenticationApi;
