import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import authenticationReducer from "@/features/authentication/reducers/AuthenticationReducer";
import mealPlanningReducer from "@/features/meal-planning/reducers";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import { rootApi } from "@/apis";
import sessionStorage from "redux-persist/lib/storage/session";

const persistConfig = {
  key: "root",
  storage: sessionStorage,
};

const rootReducer = combineReducers({
  authentication: authenticationReducer.reducer,
  mealPlanning: mealPlanningReducer,
  [rootApi.reducerPath]: rootApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rootApi.middleware),
});

export default store;
export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;
export const useStoreSelector = useSelector.withTypes<StoreState>();
export const useStoreDispatch = useDispatch.withTypes<StoreDispatch>();
export const persistor = persistStore(store);
