import { PayloadAction, createReducer, createSlice } from "@reduxjs/toolkit";

import { StoreState } from "@/store";
import { useSelector } from "react-redux";

export type PhoneReducerState = {
  isUserFormModalOpen: boolean;
};

const phoneDirectoryReducer = createSlice({
  name: "phoneDirectory",
  initialState: {
    isUserFormModalOpen: false,
  },
  reducers: {
    setUserFormModalOpenState: (state, action: PayloadAction<boolean>) => {
      state.isUserFormModalOpen = action.payload;
    },
  },
});

export default phoneDirectoryReducer;
export const phoneDirectoryActions = phoneDirectoryReducer.actions;
