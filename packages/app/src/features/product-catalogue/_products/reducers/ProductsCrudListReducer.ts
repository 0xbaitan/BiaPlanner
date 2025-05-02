import { IQueryProductDto, ProductSortBy } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { ViewType } from "@/components/ViewSegmentedButton";

export type ProductsCrudListState = {
  productsQuery: IQueryProductDto;
  view: ViewType;
};

const initialState: ProductsCrudListState = {
  productsQuery: {
    page: 1,
    limit: 25,
    search: "",
    sortBy: ProductSortBy.DEFAULT,
  },
  view: "grid",
};

export const productsCrudListSlice = createSlice({
  name: "productsCrudList",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<IQueryProductDto>>) => {
      state.productsQuery = {
        ...state.productsQuery,
        ...action.payload,
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.productsQuery.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.productsQuery.limit = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.productsQuery.search = action.payload;
    },
    setSortBy: (state, action: PayloadAction<ProductSortBy>) => {
      state.productsQuery.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.productsQuery = {
        ...initialState.productsQuery,
        sortBy: state.productsQuery.sortBy,
        page: state.productsQuery.page,
        limit: state.productsQuery.limit,
        search: state.productsQuery.search,
      };
    },
    resetAll: (state) => {
      state = initialState;
    },
    setView: (state, action: PayloadAction<ViewType>) => {
      state.view = action.payload;
    },
  },
});

export const { setFilter, setPage, setLimit, setSearch, resetFilters, setSortBy, setView, resetAll } = productsCrudListSlice.actions;
export default productsCrudListSlice.reducer;

export function useProductsCrudListState() {
  const state = useStoreSelector((state) => state.productCatalogue.productsCrudList);
  return state;
}

export function useProductsCrudListActions() {
  const dispatch = useStoreDispatch();

  return {
    setFilter: (filter: Partial<IQueryProductDto>) => dispatch(setFilter(filter)),
    setPage: (page: number) => dispatch(setPage(page)),
    setLimit: (limit: number) => dispatch(setLimit(limit)),
    setSearch: (search: string) => dispatch(setSearch(search)),
    resetFilters: () => dispatch(resetFilters()),
    setSortBy: (sortBy: ProductSortBy) => dispatch(setSortBy(sortBy)),
    setView: (view: ViewType) => dispatch(setView(view)),
    resetAll: () => dispatch(resetAll()),
  };
}
