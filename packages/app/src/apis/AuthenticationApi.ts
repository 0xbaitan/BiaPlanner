import { CreateRequestUserDto, IAccessJWTObject, ISanitisedUser, LoginRequestUserDto } from "@biaplanner/shared";

import { rootApi } from ".";

export const authenticationApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    registerUser: build.mutation<ISanitisedUser, CreateRequestUserDto>({
      query: (dto) => ({
        url: `/auth/register`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["User", "PhoneEntry"],
    }),

    loginUser: build.mutation<IAccessJWTObject, LoginRequestUserDto>({
      query: (dto) => ({
        url: `/auth/login`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["User", "PhoneEntry"],
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = authenticationApi;
