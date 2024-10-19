import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import rootReducer from "./RootReducer";

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
export const useStoreSelector = useSelector.withTypes<StoreState>();
export const useStoreDispatch = useDispatch.withTypes<StoreDispatch>();
