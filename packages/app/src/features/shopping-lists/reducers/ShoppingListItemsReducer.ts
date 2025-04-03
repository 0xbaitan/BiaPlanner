import { ICreateShoppingItemDto, IProduct } from "@biaplanner/shared";
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

  showOffcanvas: boolean;
};

const initialState: ShoppingListItemsState = {
  selectedItems: [],

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
  },
});

export const { resetShoppingListItems, addShoppingListItem, removeShoppingListItem, showOffcanvas, hideOffcanvas } = shoppingListItemsSlice.actions;
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

  return {
    resetShoppingListItems: resetShoppingListItemsCallback,
    addShoppingListItem: addShoppingListItemCallback,
    removeShoppingListItem: removeShoppingListItemCallback,
    isItemPresent: isItemPresentCallback,
    showOffcanvas: showOffcanvasCallback,
    hideOffcanvas: hideOffcanvasCallback,
    getItem: getItemCallback,
  };
}
