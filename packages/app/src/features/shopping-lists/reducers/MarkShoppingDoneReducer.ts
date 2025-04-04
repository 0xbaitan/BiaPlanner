import { IProduct, IShoppingItemExtended, IShoppingList } from "@biaplanner/shared";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { useCallback } from "react";

type MarkShoppingDoneState = {
  shoppingListId: string;
  transientUpdatedShoppingItems: IShoppingItemExtended[];
  updatedShoppingItems: IShoppingItemExtended[];
  originalShoppingItems: IShoppingItemExtended[];
  isInitialised: boolean;
  isInEditMode: boolean;
  showOffcanvas: boolean;
  currentItemToReplace: IProduct | undefined;
  offCanvasType: "replacement" | "add-extra" | undefined;
};

const initialState: MarkShoppingDoneState = {
  shoppingListId: "",
  originalShoppingItems: [],
  transientUpdatedShoppingItems: [],
  updatedShoppingItems: [],
  isInitialised: false,
  isInEditMode: false,
  showOffcanvas: false,
  offCanvasType: undefined,
  currentItemToReplace: undefined,
};

const markShoppingDoneReducer = createSlice({
  name: "markShoppingDone",
  initialState,
  reducers: {
    resetFormState: (state) => {
      state.shoppingListId = "";
      state.transientUpdatedShoppingItems = [];
      state.updatedShoppingItems = [];
      state.originalShoppingItems = [];
      state.isInitialised = false;
      state.isInEditMode = false;
      state.showOffcanvas = false;
      state.offCanvasType = undefined;
      state.currentItemToReplace = undefined;
    },
    initialiseFormState: (state, action: PayloadAction<IShoppingList>) => {
      const { payload } = action;
      if (state.isInitialised) {
        return;
      }
      state.shoppingListId = payload.id;

      const initialShoppingItems =
        payload.items?.map(
          (item): IShoppingItemExtended => ({
            ...item,
            expiryDate: item.product?.canExpire ? dayjs().toISOString() : undefined,
          })
        ) ?? [];
      state.originalShoppingItems = initialShoppingItems;
      state.updatedShoppingItems = initialShoppingItems;
      state.transientUpdatedShoppingItems = initialShoppingItems;
      state.isInitialised = true;
      state.isInEditMode = false;
      state.showOffcanvas = false;
    },
    addExtraShoppingItem: (state, action: PayloadAction<IShoppingItemExtended>) => {
      const { payload } = action;

      const existingItem = state.transientUpdatedShoppingItems?.find((item) => item.productId === payload.productId);
      if (existingItem) {
        return;
      }

      state.transientUpdatedShoppingItems?.push({
        ...payload,
        isExtra: true,
      });
    },

    removeExtraShoppingItem: (state, action: PayloadAction<string>) => {
      const { payload: id } = action;
      const indexOfItem = state.transientUpdatedShoppingItems?.findIndex((item) => item.productId === id);
      const isExtra = state.transientUpdatedShoppingItems.at(indexOfItem)?.isExtra;
      if (indexOfItem !== undefined && indexOfItem !== -1 && isExtra) {
        state.transientUpdatedShoppingItems?.splice(indexOfItem, 1);
      }
    },
    cancelShoppingItem: (state, action: PayloadAction<string>) => {
      const { payload: id } = action;
      const itemToCancel = state.transientUpdatedShoppingItems?.find((item) => item.productId === id);
      if (itemToCancel) {
        itemToCancel.isCancelled = true;
      }
    },
    uncancelShoppingItem: (state, action: PayloadAction<string>) => {
      const { payload: id } = action;
      const itemToUncancel = state.transientUpdatedShoppingItems?.find((item) => item.productId === id);
      if (itemToUncancel) {
        itemToUncancel.isCancelled = false;
      }
    },
    replaceShoppingItem: (state, action: PayloadAction<{ productId: string; replacedItem: IShoppingItemExtended }>) => {
      const { payload } = action;
      const { productId, replacedItem } = payload;
      const replacedItemIndex = state.transientUpdatedShoppingItems?.findIndex((item) => item.productId === productId);
      const replacementItem = state.transientUpdatedShoppingItems?.find((item) => item.productId === payload.replacedItem.productId);
      const originalReplacedItem = state.originalShoppingItems?.find((item) => item.productId === productId);
      if (replacedItemIndex === undefined || replacedItemIndex === -1 || replacementItem || !originalReplacedItem) {
        return;
      }

      state.transientUpdatedShoppingItems = state.transientUpdatedShoppingItems?.map((item) => {
        if (item.productId === productId) {
          return {
            ...originalReplacedItem, // reset to original item incase this is never reset
            isReplaced: true,
            replacement: replacedItem,
          };
        }
        return item;
      });
    },

    updateExpiryDate: (state, action: PayloadAction<{ id: string; expiryDate: string | undefined }>) => {
      const { payload } = action;
      const itemToUpdate = state.transientUpdatedShoppingItems?.find((item) => item.productId === payload.id);
      if (!itemToUpdate) {
        return;
      }
      state.transientUpdatedShoppingItems = state.transientUpdatedShoppingItems?.map((item) => {
        if (item.productId === payload.id) {
          if (item.isReplaced && !!item.replacement) {
            return {
              ...item,
              replacement: {
                ...item.replacement,
                expiryDate: payload.expiryDate,
              },
            };
          }
          return {
            ...item,
            expiryDate: payload.expiryDate,
          };
        }
        return item;
      });
    },

    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { payload } = action;
      const itemToUpdate = state.transientUpdatedShoppingItems?.find((item) => item.productId === payload.id);
      if (!itemToUpdate) {
        return;
      }
      state.transientUpdatedShoppingItems = state.transientUpdatedShoppingItems?.map((item) => {
        if (item.productId === payload.id) {
          if (item.isReplaced && !!item.replacement) {
            return {
              ...item,
              replacement: {
                ...item.replacement,
                quantity: payload.quantity,
              },
            };
          }
          return {
            ...item,
            quantity: payload.quantity,
          };
        }
        return item;
      });
    },

    resetItemToOriginal: (state, action: PayloadAction<string>) => {
      const { payload: id } = action;
      const itemToReset = state.transientUpdatedShoppingItems?.find((item) => item.productId === id);
      if (!itemToReset) {
        return;
      }
      const originalItem = state.originalShoppingItems?.find((item) => item.productId === id);
      if (!originalItem) {
        return;
      }
      state.transientUpdatedShoppingItems = state.transientUpdatedShoppingItems?.map((item) => {
        if (item.productId === id) {
          return {
            ...originalItem,
            isExtra: false,
            isCancelled: false,
            isReplaced: false,
            replacement: undefined,
          };
        }
        return item;
      });
    },
    openEditMode: (state) => {
      state.isInEditMode = true;
      state.transientUpdatedShoppingItems = [...state.updatedShoppingItems];
    },
    closeEditMode: (state, action: PayloadAction<boolean>) => {
      const { payload: saveChanges } = action;
      state.isInEditMode = false;
      if (saveChanges) {
        state.updatedShoppingItems = [...state.transientUpdatedShoppingItems];
      }
    },
    showAddExtraOffcanvas: (state) => {
      if (!state.isInEditMode) {
        state.showOffcanvas = false;
        return;
      }
      state.showOffcanvas = true;
      state.offCanvasType = "add-extra";
    },
    showReplacementOffcanvas: (state, action: PayloadAction<IProduct>) => {
      if (!state.isInEditMode) {
        state.showOffcanvas = false;
        return;
      }
      const { payload: productId } = action;
      state.showOffcanvas = true;
      state.offCanvasType = "replacement";
      state.currentItemToReplace = productId;
    },
    hideOffcanvas: (state) => {
      state.showOffcanvas = false;
      state.offCanvasType = undefined;
    },
  },
});

export const {
  resetFormState,
  showAddExtraOffcanvas,
  openEditMode,
  closeEditMode,
  initialiseFormState,
  addExtraShoppingItem,
  removeExtraShoppingItem,
  cancelShoppingItem,
  uncancelShoppingItem,
  replaceShoppingItem,
  updateExpiryDate,
  updateQuantity,
  hideOffcanvas,
  resetItemToOriginal,
  showReplacementOffcanvas,
} = markShoppingDoneReducer.actions;
export default markShoppingDoneReducer.reducer;

export function useMarkShoppingDoneState(): MarkShoppingDoneState {
  return useStoreSelector((state) => state.shoppingLists.markShoppingDone);
}
export function useMarkShoppingDoneActions() {
  const dispatch = useStoreDispatch();
  const { transientUpdatedShoppingItems, originalShoppingItems } = useMarkShoppingDoneState();
  const resetFormStateCallback = useCallback(() => {
    dispatch(resetFormState());
  }, [dispatch]);

  const initialiseFormStateCallback = useCallback(
    (payload: IShoppingList) => {
      dispatch(initialiseFormState(payload));
    },
    [dispatch]
  );

  const addExtraShoppingItemCallback = useCallback(
    (payload: IShoppingItemExtended) => {
      dispatch(addExtraShoppingItem(payload));
    },
    [dispatch]
  );

  const removeExtraShoppingItemCallback = useCallback(
    (productId: string) => {
      dispatch(removeExtraShoppingItem(productId));
    },
    [dispatch]
  );

  const cancelShoppingItemCallback = useCallback(
    (productId: string) => {
      dispatch(cancelShoppingItem(productId));
    },
    [dispatch]
  );

  const uncancelShoppingItemCallback = useCallback(
    (productId: string) => {
      dispatch(uncancelShoppingItem(productId));
    },
    [dispatch]
  );

  const replaceShoppingItemCallback = useCallback(
    (productId: string, replacedItem: IShoppingItemExtended) => {
      dispatch(replaceShoppingItem({ productId, replacedItem }));
    },
    [dispatch]
  );

  const updateExpiryDateCallback = useCallback(
    (productId: string, expiryDate?: string) => {
      dispatch(updateExpiryDate({ id: productId, expiryDate }));
    },
    [dispatch]
  );

  const updateQuantityCallback = useCallback(
    (productId: string, quantity: number) => {
      dispatch(updateQuantity({ id: productId, quantity }));
    },
    [dispatch]
  );

  const resetItemToOriginalCallback = useCallback(
    (productId: string) => {
      dispatch(resetItemToOriginal(productId));
    },
    [dispatch]
  );

  const getIsItemOriginalCallback = useCallback(
    (productId: string) => {
      const transientItem = transientUpdatedShoppingItems?.find((item) => item.productId === productId);
      const originalItem = originalShoppingItems?.find((item) => item.productId === productId);
      if (!transientItem || !originalItem || transientItem.isExtra) {
        return undefined;
      }
      if (originalItem.expiryDate !== transientItem.expiryDate) {
        console.log("Expiry date mismatch", { originalDate: originalItem.expiryDate, transientDate: transientItem });
      }
      return !transientItem.isCancelled && !transientItem.isReplaced && originalItem.quantity === transientItem.quantity && originalItem.expiryDate === transientItem.expiryDate;
    },
    [transientUpdatedShoppingItems, originalShoppingItems]
  );

  const getOriginalItemCallback = useCallback(
    (productId: string) => {
      const item = originalShoppingItems?.find((item) => item.productId === productId);
      return item;
    },
    [originalShoppingItems]
  );

  const openEditModeCallback = useCallback(() => {
    dispatch(openEditMode());
  }, [dispatch]);

  const closeEditModeCallback = useCallback(
    (saveChanges: boolean) => {
      dispatch(closeEditMode(saveChanges));
    },
    [dispatch]
  );

  const isItemPresentCallback = useCallback(
    (productId: string): "extra" | "non-extra" | false => {
      const item = transientUpdatedShoppingItems?.find((item) => item.productId === productId || item.replacement?.productId === productId);
      if (!item) {
        return false;
      }
      if (item.isExtra) {
        return "extra";
      }
      if (!item.isExtra) {
        return "non-extra";
      }
      return false;
    },
    [transientUpdatedShoppingItems]
  );

  const getItemCallback = useCallback(
    (productId: string) => {
      const item = transientUpdatedShoppingItems?.find((item) => item.productId === productId);
      return item;
    },
    [transientUpdatedShoppingItems]
  );

  const hideOffcanvasCallback = useCallback(() => {
    dispatch(hideOffcanvas());
  }, [dispatch]);

  const showAddExtraOffcanvasCallback = useCallback(() => {
    dispatch(showAddExtraOffcanvas());
  }, [dispatch]);

  const showReplacementOffcanvasCallback = useCallback(
    (product: IProduct) => {
      dispatch(showReplacementOffcanvas(product));
    },
    [dispatch]
  );

  return {
    resetFormState: resetFormStateCallback,
    initialiseFormState: initialiseFormStateCallback,
    addExtraShoppingItem: addExtraShoppingItemCallback,
    removeExtraShoppingItem: removeExtraShoppingItemCallback,
    cancelShoppingItem: cancelShoppingItemCallback,
    replaceShoppingItem: replaceShoppingItemCallback,
    updateExpiryDate: updateExpiryDateCallback,
    updateQuantity: updateQuantityCallback,
    resetItemToOriginal: resetItemToOriginalCallback,
    openEditMode: openEditModeCallback,
    closeEditMode: closeEditModeCallback,
    uncancelShoppingItem: uncancelShoppingItemCallback,
    getIsItemOriginal: getIsItemOriginalCallback,
    getOriginalItem: getOriginalItemCallback,
    isItemPresent: isItemPresentCallback,
    getItem: getItemCallback,
    showAddExtraOffcanvas: showAddExtraOffcanvasCallback,
    showReplacementOffcanvas: showReplacementOffcanvasCallback,
    hideOffcanvas: hideOffcanvasCallback,
  };
}

export type MarkShoppingDoneActions = ReturnType<typeof useMarkShoppingDoneActions>;
