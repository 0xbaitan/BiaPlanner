import { ConcreteRecipeSortBy, IQueryConcreteRecipeFilterParams } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { ViewType } from "@/components/ViewSegmentedButton";

export type ConcreteRecipesCrudListState = {
  concreteRecipesQuery: IQueryConcreteRecipeFilterParams;
  view: ViewType;
};

const initialState: ConcreteRecipesCrudListState = {
  view: "grid",
  concreteRecipesQuery: {
    page: 1,
    limit: 25,
    search: "",
    sortBy: ConcreteRecipeSortBy.NEWEST,
    mealType: [],
  },
};

export type ConcreteRecipeFilter = Omit<IQueryConcreteRecipeFilterParams, "page" | "limit" | "search" | "sortBy">;

export const concreteRecipesCrudListSlice = createSlice({
  name: "concreteRecipesCrudList",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<ConcreteRecipeFilter>) => {
      state.concreteRecipesQuery = {
        ...state.concreteRecipesQuery,
        ...action.payload,
      };

      console.log("Concrete recipes query updated:", state.concreteRecipesQuery);
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.concreteRecipesQuery.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.concreteRecipesQuery.limit = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.concreteRecipesQuery.search = action.payload;
    },
    setView: (state, action: PayloadAction<ViewType>) => {
      state.view = action.payload;
    },
    setSortBy: (state, action: PayloadAction<ConcreteRecipeSortBy>) => {
      state.concreteRecipesQuery.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.concreteRecipesQuery = {
        ...initialState.concreteRecipesQuery,
        sortBy: state.concreteRecipesQuery.sortBy,
        page: state.concreteRecipesQuery.page,
        limit: state.concreteRecipesQuery.limit,
        search: state.concreteRecipesQuery.search,
      };
    },
  },
});

export const { setFilter, setPage, setLimit, setSearch, resetFilters, setView, setSortBy } = concreteRecipesCrudListSlice.actions;
export default concreteRecipesCrudListSlice.reducer;

export function useConcreteRecipesCrudListState() {
  const state = useStoreSelector((state) => state.mealPlanning.concreteRecipesCrudList);
  return state;
}

export function useConcreteRecipesCrudListActions() {
  const dispatch = useStoreDispatch();

  return {
    setFilter: (filter: ConcreteRecipeFilter) => dispatch(setFilter(filter)),
    setPage: (page: number) => dispatch(setPage(page)),
    setLimit: (limit: number) => dispatch(setLimit(limit)),
    setSearch: (search: string) => dispatch(setSearch(search)),
    resetFilters: () => dispatch(resetFilters()),
    setView: (view: ViewType) => dispatch(setView(view)),
    setSortBy: (sortBy: ConcreteRecipeSortBy) => dispatch(setSortBy(sortBy)),
  };
}
