import { useStoreDispatch, useStoreSelector } from "@/store";

import { IAccessJWTObject } from "@biaplanner/shared";
import { authenticationActions } from "../reducers/AuthenticationReducer";
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

export function useIsAuthenticated() {
  const { accessTokenObject } = useAuthenticationState();
  return !!accessTokenObject;
}
