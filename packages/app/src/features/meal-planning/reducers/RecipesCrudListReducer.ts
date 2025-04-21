import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { IQueryRecipeDto } from "@biaplanner/shared";
import { ViewType } from "@/components/ViewSegmentedButton";

export type RecipesCrudListState = {
  recipesQuery: IQueryRecipeDto;
  view: ViewType;
};

const initialState: RecipesCrudListState = {
  view: "grid",
  recipesQuery: {
    page: 1,
    limit: 25,
    search: "",
  },
};

export type RecipeFilter = Omit<IQueryRecipeDto, "page" | "limit" | "search">;

export const recipesCrudListSlice = createSlice({
  name: "recipesCrudList",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<RecipeFilter>) => {
      state.recipesQuery = {
        ...state.recipesQuery,
        ...action.payload,
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.recipesQuery.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.recipesQuery.limit = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.recipesQuery.search = action.payload;
    },
    setView: (state, action: PayloadAction<ViewType>) => {
      state.view = action.payload;
    },

    resetFilters: (state) => {
      state.recipesQuery = {
        ...initialState.recipesQuery,
        page: state.recipesQuery.page,
        limit: state.recipesQuery.limit,
        search: state.recipesQuery.search,
      };
    },
  },
});

export const { setFilter, setPage, setLimit, setSearch, resetFilters, setView } = recipesCrudListSlice.actions;
export default recipesCrudListSlice.reducer;

export function useRecipesCrudListState() {
  const state = useStoreSelector((state) => state.mealPlanning.recipesCrudList);
  return state;
}

export function useRecipesCrudListActions() {
  const dispatch = useStoreDispatch();

  return {
    setFilter: (filter: RecipeFilter) => dispatch(setFilter(filter)),
    setPage: (page: number) => dispatch(setPage(page)),
    setLimit: (limit: number) => dispatch(setLimit(limit)),
    setSearch: (search: string) => dispatch(setSearch(search)),
    resetFilters: () => dispatch(resetFilters()),
    setView: (view: ViewType) => dispatch(setView(view)),
  };
}
