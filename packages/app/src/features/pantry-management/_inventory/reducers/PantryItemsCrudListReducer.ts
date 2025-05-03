import { IQueryPantryItemDto, PantryItemSortBy } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

export type ConsumePantryItemModalState = {
  isOpen: boolean;
  pantryItemId: string | null;
};

export type PantryItemsCrudListState = {
  pantryItemsQuery: IQueryPantryItemDto;
  consumePantryItemModal: ConsumePantryItemModalState;
};

const initialState: PantryItemsCrudListState = {
  pantryItemsQuery: {
    page: 1,
    limit: 25,
    search: "",
    sortBy: PantryItemSortBy.NEWEST,
  },

  consumePantryItemModal: {
    isOpen: false,
    pantryItemId: null,
  },
};

export const pantryItemsCrudListSlice = createSlice({
  name: "pantryItemsCrudList",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<IQueryPantryItemDto>>) => {
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

    openConsumePantryItemModal: (state, action: PayloadAction<string>) => {
      state.consumePantryItemModal.pantryItemId = action.payload;
      state.consumePantryItemModal.isOpen = true;
    },

    closeConsumePantryItemModal: (state) => {
      state.consumePantryItemModal.pantryItemId = null;
      state.consumePantryItemModal.isOpen = false;
    },
  },
});

export const { setFilter, setPage, setLimit, setSearch, setSortBy, resetFilters, openConsumePantryItemModal, closeConsumePantryItemModal } = pantryItemsCrudListSlice.actions;
export default pantryItemsCrudListSlice.reducer;

export function usePantryItemsCrudListState() {
  return useStoreSelector((state) => state.pantry.pantryItemsCrudList);
}

export function usePantryItemsCrudListActions() {
  const dispatch = useStoreDispatch();

  return {
    setFilter: (filter: Partial<IQueryPantryItemDto>) => dispatch(setFilter(filter)),
    setPage: (page: number) => dispatch(setPage(page)),
    setLimit: (limit: number) => dispatch(setLimit(limit)),
    setSearch: (search: string) => dispatch(setSearch(search)),
    setSortBy: (sortBy: PantryItemSortBy) => dispatch(setSortBy(sortBy)),
    resetFilters: () => dispatch(resetFilters()),
    openConsumePantryItemModal: (pantryItemId: string) => dispatch(openConsumePantryItemModal(pantryItemId)),
    closeConsumePantryItemModal: () => dispatch(closeConsumePantryItemModal()),
  };
}
