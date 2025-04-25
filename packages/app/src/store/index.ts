import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { all } from "redux-saga/effects";
import authenticationReducer from "@/features/authentication/reducers/AuthenticationReducer";
import authenticationSaga from "@/features/authentication/reducers/AuthenticationSaga";
import createSagaMiddleware from "redux-saga";
import mealPlanningReducer from "@/features/meal-planning/reducers";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import productCatalogueReducer from "@/features/product-catalogue/reducers";
import recipeCatalogueReducer from "@/features/recipe-management/reducers";
import { rootApi } from "@/apis";
import sessionStorage from "redux-persist/lib/storage/session";
import shoppingListsReducer from "@/features/shopping-lists/reducers";

const persistConfig = {
  key: "root",
  storage: sessionStorage,
  blacklist: [rootApi.reducerPath],
};

const rootReducer = combineReducers({
  authentication: authenticationReducer.reducer,
  mealPlanning: mealPlanningReducer,
  shoppingLists: shoppingListsReducer,
  recipeCatalogue: recipeCatalogueReducer,
  productCatalogue: productCatalogueReducer,
  [rootApi.reducerPath]: rootApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rootApi.middleware).concat(sagaMiddleware),
});

function* rootSaga() {
  yield all([authenticationSaga()]);
}

sagaMiddleware.run(rootSaga);
export default store;
export type StoreState = ReturnType<typeof store.getState>;

export type StoreDispatch = typeof store.dispatch;
export const useStoreSelector = useSelector.withTypes<StoreState>();
export const useStoreDispatch = useDispatch.withTypes<StoreDispatch>();
export const persistor = persistStore(store);
