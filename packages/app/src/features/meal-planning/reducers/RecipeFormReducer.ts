import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { DeepPartial } from "utility-types";
import { IRecipeIngredient } from "@biaplanner/shared";
import { useCallback } from "react";

export type RecipeFormState = {
  showIngredientModal: boolean;
  ingredientModalType?: "create" | "update";
  ingredientIndex?: number;
  ingredient: DeepPartial<IRecipeIngredient>;
  onConfirmIngredient?: (ingredient: DeepPartial<IRecipeIngredient>) => void;
  confirmedIngredients: DeepPartial<IRecipeIngredient>[];
};

const initialState: RecipeFormState = {
  showIngredientModal: false,
  ingredient: {},
  confirmedIngredients: [],
  ingredientIndex: undefined,
  ingredientModalType: undefined,
};

export type IngredientActionPayload = {
  showIngredientModal: boolean;
  ingredientModalType: IngredientActionPayload["showIngredientModal"] extends [true] ? "create" | "update" : undefined;
  ingredientIndex: IngredientActionPayload["showIngredientModal"] extends true ? number : undefined;
  ingredient: IngredientActionPayload["ingredientModalType"] extends "update" ? DeepPartial<IRecipeIngredient> : undefined;
};

export const recipeSlice = createSlice({
  name: "recipeForm",
  initialState,
  reducers: {
    openCreateIngredientModal: (
      state,
      action: PayloadAction<{
        index: number;
        onConfirmIngredient?: (ingredient: DeepPartial<IRecipeIngredient>) => void;
      }>
    ) => {
      state.showIngredientModal = true;
      state.ingredientModalType = "create";
      state.ingredientIndex = action.payload.index;
      state.onConfirmIngredient = action.payload.onConfirmIngredient;
      state.ingredient = {};
    },
    openUpdateIngredientModal: (
      state,
      action: PayloadAction<{
        index: number;
        ingredient: DeepPartial<IRecipeIngredient>;
      }>
    ) => {
      const { index, ingredient } = action.payload;
      state.showIngredientModal = true;
      state.ingredientModalType = "update";
      state.ingredientIndex = index;
      state.ingredient = ingredient;
    },

    closeIngredientModal: (state) => {
      state.showIngredientModal = false;
      state.ingredientModalType = undefined;
      state.ingredientIndex = undefined;
      state.ingredient = {};
    },
    insertIngredient: (state, action: PayloadAction<DeepPartial<IRecipeIngredient>>) => {
      state.confirmedIngredients = [...state.confirmedIngredients, action.payload];
    },
    updateIngredient: (state, action: PayloadAction<{ index: number; ingredient: DeepPartial<IRecipeIngredient> }>) => {
      state.confirmedIngredients[action.payload.index] = action.payload.ingredient;
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.confirmedIngredients.splice(action.payload, 1);
    },
    resetConfirmedIngredients: (state) => {
      state.confirmedIngredients = [];
    },
  },
});

export const { openCreateIngredientModal, openUpdateIngredientModal, closeIngredientModal, insertIngredient, updateIngredient, removeIngredient } = recipeSlice.actions;
export default recipeSlice.reducer;
export type MealPlanFormAction = typeof recipeSlice.actions;

export function useRecipeFormState(): RecipeFormState {
  return useStoreSelector((state) => state.mealPlanning.recipeForm);
}

export function useOpenCreateIngredientModal() {
  const dispatch = useStoreDispatch();
  return useCallback((payload: { index: number; onConfirmIngredient?: (ingredient: DeepPartial<IRecipeIngredient>) => void }) => dispatch(openCreateIngredientModal(payload)), [dispatch]);
}

export function useConfirmedIngredientsState() {
  const confirmedIngredients = useStoreSelector((state) => state.mealPlanning.recipeForm.confirmedIngredients);
  const dispatch = useStoreDispatch();
  const insertIngredientCallback = useCallback(
    (ingredient: DeepPartial<IRecipeIngredient>) => {
      dispatch(insertIngredient(ingredient));
    },
    [dispatch]
  );

  const updateIngredientCallback = useCallback(
    (index: number, ingredient: DeepPartial<IRecipeIngredient>) => {
      dispatch(updateIngredient({ index, ingredient }));
    },
    [dispatch]
  );

  const removeIngredientCallback = useCallback(
    (index: number) => {
      dispatch(removeIngredient(index));
    },
    [dispatch]
  );

  const resetConfirmedIngredientsCallback = useCallback(() => dispatch(recipeSlice.actions.resetConfirmedIngredients()), [dispatch]);

  return { confirmedIngredients, insertIngredient: insertIngredientCallback, updateIngredient: updateIngredientCallback, removeIngredient: removeIngredientCallback, resetConfirmedIngredients: resetConfirmedIngredientsCallback };
}

export function useOpenUpdateIngredientModal() {
  const dispatch = useStoreDispatch();
  return useCallback((index: number, ingredient: DeepPartial<IRecipeIngredient>) => dispatch(openUpdateIngredientModal({ index, ingredient })), [dispatch]);
}

export function useCloseIngredientModal() {
  const dispatch = useStoreDispatch();
  return useCallback(() => dispatch(closeIngredientModal()), [dispatch]);
}
