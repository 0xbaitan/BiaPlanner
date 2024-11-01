import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { IAccessJWTObject } from "@biaplanner/shared";

export type AuthenticationReducerState = {
  accessTokenObject: IAccessJWTObject | null;
};

const initialState: AuthenticationReducerState = {
  accessTokenObject: null,
};

const authenticationReducer = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setAccessTokenObject: (state, action: PayloadAction<IAccessJWTObject | null>) => {
      state.accessTokenObject = action.payload;
    },
  },
});

export default authenticationReducer;
export const authenticationActions = authenticationReducer.actions;
