import { ICreateConcreteRecipeDto, IRecipe } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { useStoreSelector } from "@/store";

export type MealPlanFormState = {
  selectedRecipe?: IRecipe;
};

const initialState: MealPlanFormState = {
  selectedRecipe: undefined,
};

export const mealPlanSlice = createSlice({
  name: "mealPlanForm",
  initialState,
  reducers: {
    selectRecipe: (state, action: PayloadAction<IRecipe>) => {
      state.selectedRecipe = action.payload;
    },
  },
});

export const { selectRecipe } = mealPlanSlice.actions;
export default mealPlanSlice.reducer;
export type MealPlanFormAction = typeof mealPlanSlice.actions;

export function useMealPlanFormState(): MealPlanFormState {
  return useStoreSelector((state) => state.mealPlanning.mealPlanForm);
}
