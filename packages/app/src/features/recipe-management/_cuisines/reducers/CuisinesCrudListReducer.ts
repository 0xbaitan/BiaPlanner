import { CuisineSortBy, IQueryCuisineParamsDto } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

export type CuisinesCrudListState = {
  cuisinesQuery: IQueryCuisineParamsDto;
};

const initialState: CuisinesCrudListState = {
  cuisinesQuery: {
    page: 1,
    limit: 25,
    search: "",
    sortBy: CuisineSortBy.DEFAULT,
  },
};

export type CuisineFilter = Omit<IQueryCuisineParamsDto, "page" | "limit" | "search" | "sortBy">;

export const cuisinesCrudListSlice = createSlice({
  name: "cuisinesCrudList",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<CuisineFilter>) => {
      state.cuisinesQuery = {
        ...state.cuisinesQuery,
        ...action.payload,
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.cuisinesQuery.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.cuisinesQuery.limit = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.cuisinesQuery.search = action.payload;
    },
    setSortBy: (state, action: PayloadAction<CuisineSortBy>) => {
      state.cuisinesQuery.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.cuisinesQuery = {
        ...initialState.cuisinesQuery,
        sortBy: state.cuisinesQuery.sortBy,
        page: state.cuisinesQuery.page,
        limit: state.cuisinesQuery.limit,
        search: state.cuisinesQuery.search,
      };
    },
  },
});

export const { setFilter, setPage, setLimit, setSearch, resetFilters, setSortBy } = cuisinesCrudListSlice.actions;
export default cuisinesCrudListSlice.reducer;

export function useCuisinesCrudListState() {
  const state = useStoreSelector((state) => state.recipeCatalogue.cuisinesCrudList);
  return state;
}

export function useCuisinesCrudListActions() {
  const dispatch = useStoreDispatch();

  return {
    setFilter: (filter: CuisineFilter) => dispatch(setFilter(filter)),
    setPage: (page: number) => dispatch(setPage(page)),
    setLimit: (limit: number) => dispatch(setLimit(limit)),
    setSearch: (search: string) => dispatch(setSearch(search)),
    resetFilters: () => dispatch(resetFilters()),
    setSortBy: (sortBy: CuisineSortBy) => dispatch(setSortBy(sortBy)),
  };
}
