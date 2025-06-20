import { IQueryProductCategoryDto, ProductCategoryAllergenFilter, ProductCategorySortBy } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { resetAll } from "../../_products/reducers/ProductsCrudListReducer";

export type ProductCategoriesCrudListState = {
  productCategoriesQuery: IQueryProductCategoryDto;
};

const initialState: ProductCategoriesCrudListState = {
  productCategoriesQuery: {
    page: 1,
    limit: 25,
    search: "",
    sortBy: ProductCategorySortBy.DEFAULT,
    allergenVisibility: ProductCategoryAllergenFilter.SHOW_EVERYTHING,
  },
};

export const productCategoriesCrudListSlice = createSlice({
  name: "productCategoriesCrudList",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<ProductCategoriesCrudListState["productCategoriesQuery"]>>) => {
      state.productCategoriesQuery = {
        ...state.productCategoriesQuery,
        ...action.payload,
      };
      state.productCategoriesQuery.page = 1; // Reset page to 1 when filters change
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.productCategoriesQuery.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.productCategoriesQuery.limit = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.productCategoriesQuery.search = action.payload;
      state.productCategoriesQuery.page = 1; // Reset page to 1 when search changes
    },
    setSortBy: (state, action: PayloadAction<ProductCategorySortBy>) => {
      state.productCategoriesQuery.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.productCategoriesQuery = {
        ...initialState.productCategoriesQuery,
        sortBy: state.productCategoriesQuery.sortBy, // Preserve current sortBy
        page: state.productCategoriesQuery.page, // Preserve current page
        limit: state.productCategoriesQuery.limit, // Preserve current limit
      };
    },
    resetAll: (state) => {
      state = initialState;
    },
  },
});

export const { setFilter, setPage, setLimit, setSearch, setSortBy, resetFilters } = productCategoriesCrudListSlice.actions;

export default productCategoriesCrudListSlice.reducer;

export function useProductCategoriesCrudListState() {
  return useStoreSelector((state) => state.productCatalogue.productCategoriesCrudList);
}

export function useProductCategoriesCrudListActions() {
  const dispatch = useStoreDispatch();

  return {
    setFilter: (filter: Partial<ProductCategoriesCrudListState["productCategoriesQuery"]>) => dispatch(setFilter(filter)),
    setPage: (page: number) => dispatch(setPage(page)),
    setLimit: (limit: number) => dispatch(setLimit(limit)),
    setSearch: (search: string) => dispatch(setSearch(search)),
    setSortBy: (sortBy: ProductCategorySortBy) => dispatch(setSortBy(sortBy)),
    resetFilters: () => dispatch(resetFilters()),
    resetAll: () => dispatch(resetAll()),
  };
}
