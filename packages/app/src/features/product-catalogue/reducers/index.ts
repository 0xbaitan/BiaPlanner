import brandsCrudListReducer from "../_brands/reducers/BrandsCrudListReducer";
import { combineReducers } from "@reduxjs/toolkit";
import { productCategoriesCrudListSlice } from "@/features/admin/_product-categories/reducers/ProductCategoriesCrudListReducer";
const productCatalogueReducer = combineReducers({
  productCategoriesCrudList: productCategoriesCrudListSlice.reducer,
  brandsCrudList: brandsCrudListReducer,
});

export default productCatalogueReducer;
