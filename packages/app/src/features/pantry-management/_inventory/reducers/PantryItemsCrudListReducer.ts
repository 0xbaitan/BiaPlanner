import { IQueryPantryItemFilterParams, PantryItemSortBy } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

export type PantryItemsCrudListState = {
  pantryItemsQuery: IQueryPantryItemFilterParams;
};

const initialState: PantryItemsCrudListState = {
  pantryItemsQuery: {
    page: 1,
    limit: 25,
    search: "",
    sortBy: PantryItemSortBy.NEWEST,
  },
};

export const pantryItemsCrudListSlice = createSlice({
  name: "pantryItemsCrudList",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<IQueryPantryItemFilterParams>>) => {
      state.pantryItemsQuery = {
        ...state.pantryItemsQuery,
        ...action.payload,
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pantryItemsQuery.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pantryItemsQuery.limit = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.pantryItemsQuery.search = action.payload;
    },
    setSortBy: (state, action: PayloadAction<PantryItemSortBy>) => {
      state.pantryItemsQuery.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.pantryItemsQuery = initialState.pantryItemsQuery;
    },
  },
});

export const { setFilter, setPage, setLimit, setSearch, setSortBy, resetFilters } = pantryItemsCrudListSlice.actions;
export default pantryItemsCrudListSlice.reducer;

export function usePantryItemsCrudListState() {
  return useStoreSelector((state) => state.pantry.pantryItemsCrudList);
}

export function usePantryItemsCrudListActions() {
  const dispatch = useStoreDispatch();

  return {
    setFilter: (filter: Partial<IQueryPantryItemFilterParams>) => dispatch(setFilter(filter)),
    setPage: (page: number) => dispatch(setPage(page)),
    setLimit: (limit: number) => dispatch(setLimit(limit)),
    setSearch: (search: string) => dispatch(setSearch(search)),
    setSortBy: (sortBy: PantryItemSortBy) => dispatch(setSortBy(sortBy)),
    resetFilters: () => dispatch(resetFilters()),
  };
}
