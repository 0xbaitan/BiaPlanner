import { PayloadAction, createReducer, createSlice } from "@reduxjs/toolkit";
import { PhoneEntry, IUser } from "@biaplanner/shared";

import { StoreState } from "@/store";
import { useSelector } from "react-redux";

export type PhoneReducerState = {
  isUserFormModalOpen: boolean;
  showPhoneEntryDeletionWarning: boolean;
  activePhoneEntry?: PhoneEntry;
  showUpdateUserForm: boolean;
  activeUser?: IUser;
};

const initialState: PhoneReducerState = {
  isUserFormModalOpen: false,
  showPhoneEntryDeletionWarning: false,
  showUpdateUserForm: false,
};

const phoneDirectoryReducer = createSlice({
  name: "phoneDirectory",
  initialState,
  reducers: {
    setUserFormModalOpenState: (state, action: PayloadAction<boolean>) => {
      state.isUserFormModalOpen = action.payload;
    },

    setShowPhoneEntryDeletionWarning: (state, action: PayloadAction<boolean>) => {
      state.showPhoneEntryDeletionWarning = action.payload;
    },

    setActivePhoneEntryId: (state, action: PayloadAction<PhoneEntry | undefined>) => {
      state.activePhoneEntry = action.payload;
    },

    setShowUpdateUserForm: (state, action: PayloadAction<boolean>) => {
      state.showUpdateUserForm = action.payload;
    },

    setActiveUser: (state, action: PayloadAction<IUser | undefined>) => {
      state.activeUser = action.payload;
    },
  },
});

export default phoneDirectoryReducer;
export const phoneDirectoryActions = phoneDirectoryReducer.actions;
