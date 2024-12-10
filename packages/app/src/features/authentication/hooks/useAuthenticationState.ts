import { useStoreDispatch, useStoreSelector } from "@/store";

import { IAccessJWTObject } from "@biaplanner/shared";
import { authenticationActions } from "../reducers/AuthenticationReducer";
import dayjs from "dayjs";
import { useCallback } from "react";

export default function useAuthenticationState() {
  const state = useStoreSelector((state) => state.authentication);
  return state;
}

export function useSetAcessTokenObject() {
  const dispatch = useStoreDispatch();
  const setAccessTokenObject = useCallback(
    (accessTokenObject: IAccessJWTObject) => {
      dispatch(authenticationActions.setAccessTokenObject(accessTokenObject));
    },
    [dispatch]
  );
  return setAccessTokenObject;
}

export function useUserId() {
  const { accessTokenObject } = useAuthenticationState();
  return Number(accessTokenObject?.id);
}
export function useIsAuthenticated() {
  const { accessTokenObject } = useAuthenticationState();
  return !!accessTokenObject && dayjs(accessTokenObject.expiryTime).subtract(30, "seconds").isAfter(dayjs());
}
