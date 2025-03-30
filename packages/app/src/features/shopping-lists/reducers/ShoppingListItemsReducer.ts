import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { ICreateShoppingItemDto } from "@biaplanner/shared";
import { useCallback } from "react";

export type ShoppingListItemsState = {
  selectedItems: ICreateShoppingItemDto[];
  showOffcanvas: boolean;
};

const initialState: ShoppingListItemsState = {
  selectedItems: [],
  showOffcanvas: false,
};

export type ShoppingListItemsActionPayload = {
  selectedItems: ShoppingListItemsState["selectedItems"];
};

export const shoppingListItemsSlice = createSlice({
  name: "shoppingListItems",
  initialState,
  reducers: {
    resetShoppingListItems: (state) => {
      state.selectedItems = [];
    },
    addShoppingListItem: (state, action: PayloadAction<ICreateShoppingItemDto>) => {
      const { payload } = action;
      const indexOfItem = state.selectedItems.findIndex((item) => item.productId === payload.productId);
      if (indexOfItem !== -1) {
        state.selectedItems[indexOfItem] = payload;
      } else {
        state.selectedItems.push(payload);
      }
    },
    removeShoppingListItem: (state, action: PayloadAction<ICreateShoppingItemDto>) => {
      const { payload } = action;
      const indexOfItem = state.selectedItems.findIndex((item) => item.productId === payload.productId);
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
  const resetShoppingListItemsCallback = useCallback(() => {
    dispatch(resetShoppingListItems());
  }, [dispatch]);

  const addShoppingListItemCallback = useCallback(
    (payload: ICreateShoppingItemDto) => {
      dispatch(addShoppingListItem(payload));
    },
    [dispatch]
  );

  const removeShoppingListItemCallback = useCallback(
    (payload: ICreateShoppingItemDto) => {
      dispatch(removeShoppingListItem(payload));
    },
    [dispatch]
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
    showOffcanvas: showOffcanvasCallback,
    hideOffcanvas: hideOffcanvasCallback,
  };
}
