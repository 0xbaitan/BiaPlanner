import { ICreatePantryItemDto, ICreateShoppingItemExtendedDto, IShoppingItem, IShoppingItemExtended, IShoppingList, IUpdateShoppingItemExtendedDto } from "@biaplanner/shared";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { PayloadAction } from "@reduxjs/toolkit";
import { assert } from "console";
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
};

const initialState: MarkShoppingDoneState = {
  shoppingListId: "",
  originalShoppingItems: [],
  transientUpdatedShoppingItems: [],
  updatedShoppingItems: [],
  isInitialised: false,
  isInEditMode: false,
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
    cancelShoppingItem: (state, action: PayloadAction<string>) => {
      const { payload: id } = action;
      const itemToCancel = state.transientUpdatedShoppingItems?.find((item) => item.id === id);
      if (itemToCancel) {
        itemToCancel.isCancelled = true;
      }
    },
    uncancelShoppingItem: (state, action: PayloadAction<string>) => {
      const { payload: id } = action;
      const itemToUncancel = state.transientUpdatedShoppingItems?.find((item) => item.id === id);
      if (itemToUncancel) {
        itemToUncancel.isCancelled = false;
      }
    },
    replaceShoppingItem: (state, action: PayloadAction<{ id: string; replacedItem: IShoppingItemExtended }>) => {
      const { payload } = action;
      const itemToReplace = state.transientUpdatedShoppingItems?.find((item) => item.id === payload.id);
      const replacementItem = state.transientUpdatedShoppingItems?.find((item) => item.productId === payload.replacedItem.productId);

      if (!itemToReplace || replacementItem) {
        return;
      }

      itemToReplace.isReplaced = true;
      itemToReplace.replacement = replacementItem;

      state.transientUpdatedShoppingItems?.push({
        ...payload.replacedItem,
      });
    },

    updateExpiryDate: (state, action: PayloadAction<{ id: string; expiryDate: string | undefined }>) => {
      const { payload } = action;
      const itemToUpdate = state.transientUpdatedShoppingItems?.find((item) => item.id === payload.id);
      if (!itemToUpdate) {
        return;
      }
      state.transientUpdatedShoppingItems = state.transientUpdatedShoppingItems?.map((item) => {
        if (item.id === payload.id) {
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
      const itemToUpdate = state.transientUpdatedShoppingItems?.find((item) => item.id === payload.id);
      if (!itemToUpdate) {
        return;
      }
      state.transientUpdatedShoppingItems = state.transientUpdatedShoppingItems?.map((item) => {
        if (item.id === payload.id) {
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
      const itemToReset = state.transientUpdatedShoppingItems?.find((item) => item.id === id);
      if (!itemToReset) {
        return;
      }
      const originalItem = state.originalShoppingItems?.find((item) => item.id === id);
      if (!originalItem) {
        return;
      }
      state.transientUpdatedShoppingItems = state.transientUpdatedShoppingItems?.map((item) => {
        if (item.id === id) {
          return {
            ...originalItem,
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
  },
});

export const { resetFormState, openEditMode, closeEditMode, initialiseFormState, addExtraShoppingItem, cancelShoppingItem, uncancelShoppingItem, replaceShoppingItem, updateExpiryDate, updateQuantity, resetItemToOriginal } =
  markShoppingDoneReducer.actions;
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

  const cancelShoppingItemCallback = useCallback(
    (id: string) => {
      dispatch(cancelShoppingItem(id));
    },
    [dispatch]
  );

  const uncancelShoppingItemCallback = useCallback(
    (id: string) => {
      dispatch(uncancelShoppingItem(id));
    },
    [dispatch]
  );

  const replaceShoppingItemCallback = useCallback(
    (id: string, replacedItem: IShoppingItemExtended) => {
      dispatch(replaceShoppingItem({ id, replacedItem }));
    },
    [dispatch]
  );

  const updateExpiryDateCallback = useCallback(
    (id: string, expiryDate?: string) => {
      dispatch(updateExpiryDate({ id, expiryDate }));
    },
    [dispatch]
  );

  const updateQuantityCallback = useCallback(
    (id: string, quantity: number) => {
      dispatch(updateQuantity({ id, quantity }));
    },
    [dispatch]
  );

  const resetItemToOriginalCallback = useCallback(
    (id: string) => {
      dispatch(resetItemToOriginal(id));
    },
    [dispatch]
  );

  const getIsItemOriginalCallback = useCallback(
    (id: string) => {
      const transientItem = transientUpdatedShoppingItems?.find((item) => item.id === id);
      const originalItem = originalShoppingItems?.find((item) => item.id === id);
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

  const openEditModeCallback = useCallback(() => {
    dispatch(openEditMode());
  }, [dispatch]);

  const closeEditModeCallback = useCallback(
    (saveChanges: boolean) => {
      dispatch(closeEditMode(saveChanges));
    },
    [dispatch]
  );

  return {
    resetFormState: resetFormStateCallback,
    initialiseFormState: initialiseFormStateCallback,
    addExtraShoppingItem: addExtraShoppingItemCallback,
    cancelShoppingItem: cancelShoppingItemCallback,
    replaceShoppingItem: replaceShoppingItemCallback,
    updateExpiryDate: updateExpiryDateCallback,
    updateQuantity: updateQuantityCallback,
    resetItemToOriginal: resetItemToOriginalCallback,
    openEditMode: openEditModeCallback,
    closeEditMode: closeEditModeCallback,
    uncancelShoppingItem: uncancelShoppingItemCallback,
    getIsItemOriginal: getIsItemOriginalCallback,
  };
}
