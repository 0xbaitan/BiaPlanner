import { PermissionAreaAndKey } from "@biaplanner/shared";
import { useAuthenticationState } from "../reducers/AuthenticationReducer";
import { useCallback } from "react";
import { useGetCurrentAuthenticatedUserRolesQuery } from "@/apis/RolesApi";

export function useContainsNecessaryPermission() {
  const { isAuthenticated } = useAuthenticationState();
  const {
    data: roles,
    isSuccess,
    isError,
    isLoading,
  } = useGetCurrentAuthenticatedUserRolesQuery(undefined, {
    skip: !isAuthenticated,

    refetchOnReconnect: true,
  });

  const containsNecessaryPermission = useCallback(
    (index: PermissionAreaAndKey) => {
      const { area, key } = index;
      if (!isSuccess || isError || isLoading) {
        return false;
      }
      if (roles === undefined) {
        return false;
      }
      const permissions = roles.flatMap((role) => role.permissions);
      const authorised = permissions.some((permission) => {
        return !!(permission[area] && permission[area][key]);
      });

      return authorised;
    },
    [isSuccess, isError, isLoading, roles]
  );

  return containsNecessaryPermission;
}
