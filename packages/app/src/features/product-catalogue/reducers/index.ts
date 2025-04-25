import brandsCrudListReducer from "../_brands/reducers/BrandsCrudListReducer";
import { combineReducers } from "@reduxjs/toolkit";
import { productCategoriesCrudListSlice } from "@/features/product-catalogue/_product-categories/reducers/ProductCategoriesCrudListReducer";
import productsCrudListReducer from "../_products/reducers/ProductsCrudListReducer";
const productCatalogueReducer = combineReducers({
  productCategoriesCrudList: productCategoriesCrudListSlice.reducer,
  brandsCrudList: brandsCrudListReducer,
  productsCrudList: productsCrudListReducer,
});

export default productCatalogueReducer;
