import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { IRecipe } from "@biaplanner/shared";

export type MealPlanFormState = {
  selectedRecipe?: IRecipe;
  isRecipeOffcanvasVisible: boolean;
};

const initialState: MealPlanFormState = {
  selectedRecipe: undefined,
  isRecipeOffcanvasVisible: false,
};

export const mealPlanSlice = createSlice({
  name: "mealPlanForm",
  initialState,
  reducers: {
    showRecipeSelectionOffcanvas: (state) => {
      state.isRecipeOffcanvasVisible = true;
    },
    selectRecipe: (state, action: PayloadAction<IRecipe>) => {
      state.selectedRecipe = action.payload;
      state.isRecipeOffcanvasVisible = false;
    },
    hideRecipeSelectionOffcanvas: (state) => {
      state.isRecipeOffcanvasVisible = false;
    },
  },
});

export const { selectRecipe } = mealPlanSlice.actions;
export default mealPlanSlice.reducer;
export type MealPlanFormAction = typeof mealPlanSlice.actions;

export function useMealPlanFormState(): MealPlanFormState {
  return useStoreSelector((state) => state.mealPlanning.mealPlanForm);
}

export function useMealPlanFormActions() {
  const dispatch = useStoreDispatch();

  return {
    selectRecipe: (recipe: IRecipe) => dispatch(selectRecipe(recipe)),
    showRecipeSelectionOffcanvas: () => dispatch(mealPlanSlice.actions.showRecipeSelectionOffcanvas()),
    hideRecipeSelectionOffcanvas: () => dispatch(mealPlanSlice.actions.hideRecipeSelectionOffcanvas()),
  };
}
