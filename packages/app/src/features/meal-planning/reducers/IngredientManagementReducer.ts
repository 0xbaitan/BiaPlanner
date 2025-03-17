import { CreatePantryItemPortionDto, IRecipe, IRecipeIngredient } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { useCallback } from "react";

export type IngredientManagementState = {
  selectedRecipe?: IRecipe;
  mappedIngredients?: Record<string, CreatePantryItemPortionDto[]>;

  selectedIngredientId?: string;
};

const initialState: IngredientManagementState = {
  selectedRecipe: undefined,
  mappedIngredients: {},
  selectedIngredientId: undefined,
};

export const ingredientManagementSlice = createSlice({
  name: "ingredientManagement",
  initialState,
  reducers: {
    selectRecipe: (state, action: PayloadAction<IRecipe>) => {
      state.selectedRecipe = action.payload;
    },
    mapIngredients: (state, action: PayloadAction<Record<string, CreatePantryItemPortionDto[]>>) => {
      state.mappedIngredients = action.payload;
    },

    selectIngredient: (state, action: PayloadAction<string>) => {
      state.selectedIngredientId = action.payload;
    },
  },
});

export const { selectRecipe, mapIngredients, selectIngredient } = ingredientManagementSlice.actions;

export default ingredientManagementSlice.reducer;
export type IngredientManagementAction = typeof ingredientManagementSlice.actions;

export function useIngredientManagementState(): IngredientManagementState {
  return useStoreSelector((state) => state.mealPlanning.ingredientManagement);
}

export function useSelectRecipe() {
  const dispatch = useStoreDispatch();
  const selectRecipe = useCallback((recipe: IRecipe) => dispatch(ingredientManagementSlice.actions.selectRecipe(recipe)), [dispatch]);
  return selectRecipe;
}

export function useMapIngredients() {
  const dispatch = useStoreDispatch();
  const mapIngredients = useCallback((ingredients: Record<string, CreatePantryItemPortionDto[]>) => dispatch(ingredientManagementSlice.actions.mapIngredients(ingredients)), [dispatch]);
  return mapIngredients;
}

export function useSelectIngredient() {
  const dispatch = useStoreDispatch();
  const selectIngredient = useCallback((ingredientId: string) => dispatch(ingredientManagementSlice.actions.selectIngredient(ingredientId)), [dispatch]);
  return selectIngredient;
}
