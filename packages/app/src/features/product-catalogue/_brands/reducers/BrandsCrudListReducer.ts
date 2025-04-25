import { BrandSortBy, IQueryBrandParamsDto } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { ViewType } from "@/components/ViewSegmentedButton";

export type BrandsCrudListState = {
  brandsQuery: IQueryBrandParamsDto;
  view: ViewType;
};

const initialState: BrandsCrudListState = {
  brandsQuery: {
    page: 1,
    limit: 25,
    search: "",
    sortBy: BrandSortBy.DEFAULT,
  },
  view: "grid",
};

export type BrandFilter = Omit<IQueryBrandParamsDto, "page" | "limit" | "search" | "sortBy">;

export const brandsCrudListSlice = createSlice({
  name: "brandsCrudList",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<BrandFilter>) => {
      state.brandsQuery = {
        ...state.brandsQuery,
        ...action.payload,
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.brandsQuery.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.brandsQuery.limit = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.brandsQuery.search = action.payload;
    },
    setSortBy: (state, action: PayloadAction<BrandSortBy>) => {
      state.brandsQuery.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.brandsQuery = {
        ...initialState.brandsQuery,
        sortBy: state.brandsQuery.sortBy,
        page: state.brandsQuery.page,
        limit: state.brandsQuery.limit,
        search: state.brandsQuery.search,
      };
    },
    setView: (state, action: PayloadAction<ViewType>) => {
      state.view = action.payload;
    },
  },
});

export const { setFilter, setPage, setLimit, setSearch, resetFilters, setSortBy, setView } = brandsCrudListSlice.actions;
export default brandsCrudListSlice.reducer;

export function useBrandsCrudListState() {
  const state = useStoreSelector((state) => state.productCatalogue.brandsCrudList);
  return state;
}

export function useBrandsCrudListActions() {
  const dispatch = useStoreDispatch();

  return {
    setFilter: (filter: BrandFilter) => dispatch(setFilter(filter)),
    setPage: (page: number) => dispatch(setPage(page)),
    setLimit: (limit: number) => dispatch(setLimit(limit)),
    setSearch: (search: string) => dispatch(setSearch(search)),
    resetFilters: () => dispatch(resetFilters()),
    setSortBy: (sortBy: BrandSortBy) => dispatch(setSortBy(sortBy)),
    setView: (view: ViewType) => dispatch(setView(view)),
  };
}
