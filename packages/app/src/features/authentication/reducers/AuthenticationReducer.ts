import { IAccessJWTObject, IRefreshJWTObject, IUser } from "@biaplanner/shared";
import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { LoginFormData } from "../components/LoginForm";
import { set } from "react-hook-form";

export type AuthenticationReducerState = {
  accessTokenObject?: IAccessJWTObject;
  refreshTokenObject?: IRefreshJWTObject;
  isAuthenticated: boolean;
  user?: IUser;
};

const initialState: AuthenticationReducerState = {
  accessTokenObject: undefined,
  refreshTokenObject: undefined,
  isAuthenticated: false,
  user: undefined,
};

const authenticationReducer = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setAuthenticationState: (state, action: PayloadAction<Partial<Omit<AuthenticationReducerState, "isAuthenticated">>>) => {
      const { accessTokenObject, refreshTokenObject, user } = action.payload;
      state.accessTokenObject = accessTokenObject;
      state.refreshTokenObject = refreshTokenObject;
      state.user = user;
      state.isAuthenticated = !!accessTokenObject && !!refreshTokenObject && !!user;
    },
  },
});

export const initiateLogin = createAction<LoginFormData>("authentication/initiateLogin");
export const initiateLogout = createAction("authentication/initiateLogout");

export default authenticationReducer;
export const { setAuthenticationState } = authenticationReducer.actions;

export function useAuthenticationState() {
  const state = useStoreSelector((state) => state.authentication);
  return state;
}

export function useAuthenticationActions() {
  const { setAuthenticationState } = authenticationReducer.actions;

  const dispatch = useStoreDispatch();

  const setAuthenticationStateCallback = (accessTokenObject?: IAccessJWTObject, refreshTokenObject?: IRefreshJWTObject, user?: IUser) => {
    dispatch(
      setAuthenticationState({
        accessTokenObject,
        refreshTokenObject,
        user,
      })
    );
  };
  return {
    setAuthenticationState: setAuthenticationStateCallback,
  };
}
