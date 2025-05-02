import { IProduct, IQueryProductDto, ProductSortBy } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { useCallback } from "react";

export type ShoppingListItem = {
  productId: string;
  product: IProduct;
  quantity: number;
};

export type ShoppingListItemsState = {
  selectedItems: ShoppingListItem[];
  paginateQuery: IQueryProductDto;
  showOffcanvas: boolean;
};

const initialPaginateQuery: IQueryProductDto = {
  sortBy: ProductSortBy.DEFAULT,
  search: "",
  page: 1,
  limit: 25,
  isLoose: false,
  brandIds: [],
  productCategoryIds: [],
  isNonExpirable: false,
};

const initialState: ShoppingListItemsState = {
  selectedItems: [],
  paginateQuery: initialPaginateQuery,

  showOffcanvas: false,
};

export const shoppingListItemsSlice = createSlice({
  name: "shoppingListItems",
  initialState,
  reducers: {
    resetShoppingListItems: (state) => {
      state.selectedItems = [];
    },
    addShoppingListItem: (state, action: PayloadAction<ShoppingListItem>) => {
      const { payload } = action;
      const indexOfItem = state.selectedItems.findIndex((item) => item.productId === payload.productId);
      if (indexOfItem !== -1) {
        state.selectedItems[indexOfItem] = payload;
      } else {
        state.selectedItems.push(payload);
      }
    },
    removeShoppingListItem: (state, action: PayloadAction<string>) => {
      const { payload: productId } = action;
      const indexOfItem = state.selectedItems.findIndex((item) => item.productId === productId);
      if (indexOfItem !== -1) {
        state.selectedItems.splice(indexOfItem, 1);
      }
    },
    showOffcanvas: (state) => {
      state.showOffcanvas = true;
    },
    hideOffcanvas: (state) => {
      state.showOffcanvas = false;
    },

    setFilter: (state, action: PayloadAction<Partial<IQueryProductDto>>) => {
      const { payload } = action;
      state.paginateQuery = {
        ...state.paginateQuery,
        ...payload,
      };
    },

    setSortBy: (state, action: PayloadAction<ProductSortBy>) => {
      const { payload } = action;
      state.paginateQuery.sortBy = payload;
    },

    setPage: (state, action: PayloadAction<number>) => {
      const { payload } = action;
      state.paginateQuery.page = payload;
    },

    setLimit: (state, action: PayloadAction<number>) => {
      const { payload } = action;
      state.paginateQuery.limit = payload;
    },

    setSearch: (state, action: PayloadAction<string>) => {
      const { payload } = action;
      state.paginateQuery.search = payload;
    },

    resetFilters: (state) => {
      state.paginateQuery = {
        ...initialPaginateQuery,
        page: state.paginateQuery.page,
        limit: state.paginateQuery.limit,
        sortBy: state.paginateQuery.sortBy,
        search: state.paginateQuery.search,
      };
    },
  },
});

export const { resetShoppingListItems, addShoppingListItem, removeShoppingListItem, showOffcanvas, hideOffcanvas, setFilter, setSortBy, setPage, setLimit, setSearch, resetFilters } = shoppingListItemsSlice.actions;
export default shoppingListItemsSlice.reducer;

export function useShoppingListItemsState(): ShoppingListItemsState {
  return useStoreSelector((state) => state.shoppingLists.shoppingListItems);
}

export function useShoppingListItemsActions() {
  const dispatch = useStoreDispatch();
  const state = useShoppingListItemsState();
  const resetShoppingListItemsCallback = useCallback(() => {
    dispatch(resetShoppingListItems());
  }, [dispatch]);

  const addShoppingListItemCallback = useCallback(
    (payload: ShoppingListItem) => {
      dispatch(addShoppingListItem(payload));
    },
    [dispatch]
  );

  const removeShoppingListItemCallback = useCallback(
    (productId: string) => {
      dispatch(removeShoppingListItem(productId));
    },
    [dispatch]
  );

  const isItemPresentCallback = useCallback(
    (productId: string) => {
      return state.selectedItems.some((item) => item.productId === productId);
    },
    [state.selectedItems]
  );

  const getItemCallback = useCallback(
    (productId: string) => {
      return state.selectedItems.find((item) => item.productId === productId);
    },
    [state.selectedItems]
  );

  const showOffcanvasCallback = useCallback(() => {
    dispatch(showOffcanvas());
  }, [dispatch]);

  const hideOffcanvasCallback = useCallback(() => {
    dispatch(hideOffcanvas());
  }, [dispatch]);

  const setFilterCallback = useCallback(
    (payload: Partial<IQueryProductDto>) => {
      dispatch(setFilter(payload));
    },
    [dispatch]
  );

  const setSortByCallback = useCallback(
    (payload: ProductSortBy) => {
      dispatch(setSortBy(payload));
    },
    [dispatch]
  );

  const setPageCallback = useCallback(
    (payload: number) => {
      dispatch(setPage(payload));
    },
    [dispatch]
  );

  const setLimitCallback = useCallback(
    (payload: number) => {
      dispatch(setLimit(payload));
    },
    [dispatch]
  );

  const setSearchCallback = useCallback(
    (payload: string) => {
      dispatch(setSearch(payload));
    },
    [dispatch]
  );

  const resetFiltersCallback = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  return {
    resetShoppingListItems: resetShoppingListItemsCallback,
    addShoppingListItem: addShoppingListItemCallback,
    removeShoppingListItem: removeShoppingListItemCallback,
    isItemPresent: isItemPresentCallback,
    showOffcanvas: showOffcanvasCallback,
    hideOffcanvas: hideOffcanvasCallback,
    getItem: getItemCallback,
    setFilter: setFilterCallback,
    setSortBy: setSortByCallback,
    setPage: setPageCallback,
    setLimit: setLimitCallback,
    setSearch: setSearchCallback,
    resetFilters: resetFiltersCallback,
  };
}

export type ShoppingListItemsActions = ReturnType<typeof useShoppingListItemsActions>;
