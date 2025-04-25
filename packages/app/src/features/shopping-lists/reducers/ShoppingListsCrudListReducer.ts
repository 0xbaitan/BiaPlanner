import { IQueryShoppingListFilterParams, ShoppingListSortBy } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

export type ShoppingListsCrudListState = {
  shoppingListsQuery: IQueryShoppingListFilterParams;
};

const initialState: ShoppingListsCrudListState = {
  shoppingListsQuery: {
    page: 1,
    limit: 25,
    search: "",
    sortBy: ShoppingListSortBy.NEWEST,
  },
};

export const shoppingListsCrudListSlice = createSlice({
  name: "shoppingListsCrudList",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<IQueryShoppingListFilterParams>>) => {
      state.shoppingListsQuery = {
        ...state.shoppingListsQuery,
        ...action.payload,
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.shoppingListsQuery.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.shoppingListsQuery.limit = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.shoppingListsQuery.search = action.payload;
    },
    setSortBy: (state, action: PayloadAction<ShoppingListSortBy>) => {
      state.shoppingListsQuery.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.shoppingListsQuery = initialState.shoppingListsQuery;
    },
  },
});

export const { setFilter, setPage, setLimit, setSearch, setSortBy, resetFilters } = shoppingListsCrudListSlice.actions;
export default shoppingListsCrudListSlice.reducer;

export function useShoppingListsCrudListState() {
  return useStoreSelector((state) => state.shoppingLists.shoppingListsCrudList);
}

export function useShoppingListsCrudListActions() {
  const dispatch = useStoreDispatch();

  return {
    setFilter: (filter: Partial<IQueryShoppingListFilterParams>) => dispatch(setFilter(filter)),
    setPage: (page: number) => dispatch(setPage(page)),
    setLimit: (limit: number) => dispatch(setLimit(limit)),
    setSearch: (search: string) => dispatch(setSearch(search)),
    setSortBy: (sortBy: ShoppingListSortBy) => dispatch(setSortBy(sortBy)),
    resetFilters: () => dispatch(resetFilters()),
  };
}
