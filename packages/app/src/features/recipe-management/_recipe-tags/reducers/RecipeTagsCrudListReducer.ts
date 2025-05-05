import { IQueryRecipeTagDto, RecipeTagSortBy } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

export type RecipeTagsCrudListState = {
  recipeTagsQuery: IQueryRecipeTagDto;
};

const initialState: RecipeTagsCrudListState = {
  recipeTagsQuery: {
    page: 1,
    limit: 25,
    search: "",
    sortBy: RecipeTagSortBy.DEFAULT,
  },
};

export type RecipeTagFilter = Omit<IQueryRecipeTagDto, "page" | "limit" | "search" | "sortBy">;

export const recipeTagsCrudListSlice = createSlice({
  name: "recipeTagsCrudList",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<RecipeTagFilter>) => {
      state.recipeTagsQuery = {
        ...state.recipeTagsQuery,
        ...action.payload,
      };
      state.recipeTagsQuery.page = 1; // Reset page to 1 when filters change
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.recipeTagsQuery.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.recipeTagsQuery.limit = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.recipeTagsQuery.search = action.payload;
      state.recipeTagsQuery.page = 1; // Reset page to 1 when search changes
    },
    setSortBy: (state, action: PayloadAction<RecipeTagSortBy>) => {
      state.recipeTagsQuery.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.recipeTagsQuery = {
        ...initialState.recipeTagsQuery,
        sortBy: state.recipeTagsQuery.sortBy,
        page: state.recipeTagsQuery.page,
        limit: state.recipeTagsQuery.limit,
        search: state.recipeTagsQuery.search,
      };
    },
  },
});

export const { setFilter, setPage, setLimit, setSearch, resetFilters, setSortBy } = recipeTagsCrudListSlice.actions;
export default recipeTagsCrudListSlice.reducer;

export function useRecipeTagsCrudListState() {
  const state = useStoreSelector((state) => state.recipeCatalogue.recipeTagsCrudList);
  return state;
}

export function useRecipeTagsCrudListActions() {
  const dispatch = useStoreDispatch();

  return {
    setFilter: (filter: RecipeTagFilter) => dispatch(setFilter(filter)),
    setPage: (page: number) => dispatch(setPage(page)),
    setLimit: (limit: number) => dispatch(setLimit(limit)),
    setSearch: (search: string) => dispatch(setSearch(search)),
    resetFilters: () => dispatch(resetFilters()),
    setSortBy: (sortBy: RecipeTagSortBy) => dispatch(setSortBy(sortBy)),
  };
}
