import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import authenticationReducer from "@/features/authentication/reducers/AuthenticationReducer";
import phoneDirectoryReducer from "@/features/phone-directory/reducers/PhoneDirectoryReducer";
import { rootApi } from "@/apis";

const store = configureStore({
  reducer: {
    phoneDirectory: phoneDirectoryReducer.reducer,
    authentication: authenticationReducer.reducer,
    [rootApi.reducerPath]: rootApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rootApi.middleware),
});

export default store;
export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
export const useStoreSelector = useSelector.withTypes<StoreState>();
export const useStoreDispatch = useDispatch.withTypes<StoreDispatch>();
