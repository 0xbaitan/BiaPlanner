import { IAccessJWTObject, ICreateUserDto, ILoginUserDto, IRefreshJWTObject, IUser } from "@biaplanner/shared";

import { rootApi } from ".";

export const authenticationApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    registerUser: build.mutation<IUser, ICreateUserDto>({
      query: (dto) => ({
        url: `/auth/register`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["User", "PhoneEntry", "Brand", "Product", "ProductCategory", "Reminder", "Cuisine", "Recipe", "RecipeTag"],
    }),

    loginUser: build.mutation<{ accessTokenObj: IAccessJWTObject; refreshTokenObj: IRefreshJWTObject; user: IUser }, ILoginUserDto>({
      query: (dto) => ({
        url: `/auth/login`,
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["User", "PhoneEntry", "Brand", "Product", "ProductCategory", "Reminder", "Cuisine", "Recipe", "RecipeTag"],
    }),

    logoutUser: build.mutation<void, void>({
      query: () => ({
        url: `/auth/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User", "PhoneEntry", "Brand", "Product", "ProductCategory", "Reminder", "Cuisine", "Recipe", "RecipeTag"],
    }),

    refreshToken: build.mutation({
      query: (refreshTokenObj?: IRefreshJWTObject) => ({
        url: `/auth/refresh`,
        method: "POST",
        body: refreshTokenObj ?? {},
      }),
      invalidatesTags: ["User", "PhoneEntry", "Brand", "Product", "ProductCategory", "Reminder", "Cuisine", "Recipe", "RecipeTag"],
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useRefreshTokenMutation, useLogoutUserMutation } = authenticationApi;
