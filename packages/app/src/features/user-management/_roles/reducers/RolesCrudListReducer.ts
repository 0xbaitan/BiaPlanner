import { IQueryRoleDto, RolesSortBy } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

export type RolesCrudListState = {
  rolesQuery: IQueryRoleDto;
};

const initialState: RolesCrudListState = {
  rolesQuery: {
    page: 1,
    limit: 25,
    search: "",
    sortBy: RolesSortBy.NEWEST,
  },
};

export type RoleFilter = Omit<IQueryRoleDto, "page" | "limit" | "search" | "sortBy">;

export const rolesCrudListSlice = createSlice({
  name: "rolesCrudList",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<RoleFilter>) => {
      state.rolesQuery = {
        ...state.rolesQuery,
        ...action.payload,
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.rolesQuery.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.rolesQuery.limit = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.rolesQuery.search = action.payload;
    },
    setSortBy: (state, action: PayloadAction<RolesSortBy>) => {
      state.rolesQuery.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.rolesQuery = {
        ...initialState.rolesQuery,
        sortBy: state.rolesQuery.sortBy,
        page: state.rolesQuery.page,
        limit: state.rolesQuery.limit,
        search: state.rolesQuery.search,
      };
    },
  },
});

export const { setFilter, setPage, setLimit, setSearch, resetFilters, setSortBy } = rolesCrudListSlice.actions;
export default rolesCrudListSlice.reducer;

export function useRolesCrudListState() {
  const state = useStoreSelector((state) => state.userManagement.rolesCrudList);
  return state;
}

export function useRolesCrudListActions() {
  const dispatch = useStoreDispatch();

  return {
    setFilter: (filter: RoleFilter) => dispatch(setFilter(filter)),
    setPage: (page: number) => dispatch(setPage(page)),
    setLimit: (limit: number) => dispatch(setLimit(limit)),
    setSearch: (search: string) => dispatch(setSearch(search)),
    resetFilters: () => dispatch(resetFilters()),
    setSortBy: (sortBy: RolesSortBy) => dispatch(setSortBy(sortBy)),
  };
}
