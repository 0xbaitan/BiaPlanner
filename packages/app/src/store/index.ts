import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { rootApi } from "@/apis";
import rootReducer from "./RootReducer";

const store = configureStore({
  reducer: combineReducers({
    [rootApi.reducerPath]: rootApi.reducer,
   
  }),
  middleware: (getDefaultMiddleware) => (getDefaultMiddleware().concat(rootApi.middleware))
});

export default store;
export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
export const useStoreSelector = useSelector.withTypes<StoreState>();
export const useStoreDispatch = useDispatch.withTypes<StoreDispatch>();
