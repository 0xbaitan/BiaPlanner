import { combineReducers } from "@reduxjs/toolkit";
import { productCategoriesCrudListSlice } from "@/features/admin/_product-categories/reducers/ProductCategoriesCrudListReducer";

const productCatalogueReducer = combineReducers({
  productCategoriesCrudList: productCategoriesCrudListSlice.reducer,
});

export default productCatalogueReducer;
