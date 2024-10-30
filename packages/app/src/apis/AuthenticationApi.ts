import { CreateRequestUserDto, ISanitisedUser } from "@biaplanner/shared";

import { rootApi } from ".";

export const authenticationApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    registerUser: build.mutation<ISanitisedUser, CreateRequestUserDto>({
      query: (dto) => ({
        url: `/auth/register`,
        method: "POST",
        body: dto,
      }),
    }),
  }),
});
