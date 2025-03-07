import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { useCallback } from "react";

export type RecipeFormState = {
  showIngredientModal: boolean;
};

const initialState: RecipeFormState = {
  showIngredientModal: false,
};

export const recipeSlice = createSlice({
  name: "recipeForm",
  initialState,
  reducers: {
    setShowIngredientModal: (state, action: PayloadAction<boolean>) => {
      state.showIngredientModal = action.payload;
    },
  },
});

export const { setShowIngredientModal } = recipeSlice.actions;
export default recipeSlice.reducer;
export type MealPlanFormAction = typeof recipeSlice.actions;

export function useRecipeFormState(): RecipeFormState {
  return useStoreSelector((state) => state.mealPlanning.recipeForm);
}

export function useSetShowIngredientModal() {
  const dispatch = useStoreDispatch();
  const setIngredientModalVisibility = useCallback(
    (show: boolean) => {
      dispatch(setShowIngredientModal(show));
    },
    [dispatch]
  );
  return setIngredientModalVisibility;
}
