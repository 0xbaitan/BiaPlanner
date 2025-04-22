import { IWriteRecipeIngredientDto, Weights, WriteRecipeFormattedErrors, WriteRecipeIngredientErrors } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { DeepPartial } from "react-hook-form";

export type RecipeFormState = {
  showIngredientModal: boolean;
  modalType?: "create" | "update";
  ingredientIndex?: number;
  currentIngredient: IWriteRecipeIngredientDto;
  errors?: WriteRecipeIngredientErrors;
};

const defaultIngredient: IWriteRecipeIngredientDto = {
  title: "",
  measurement: {
    magnitude: 0,
    unit: Weights.GRAM,
  },
  productCategories: [],
};
const initialState: RecipeFormState = {
  showIngredientModal: false,
  modalType: undefined,
  ingredientIndex: undefined,
  currentIngredient: defaultIngredient,
  errors: undefined,
};

export const recipeSlice = createSlice({
  name: "recipeForm",
  initialState,
  reducers: {
    openCreateIngredientModal: (state) => {
      state.showIngredientModal = true;
      state.modalType = "create";
      state.ingredientIndex = undefined;
      state.errors = undefined;
      state.currentIngredient = defaultIngredient;
    },

    openUpdateIngredientModal: (state, action: PayloadAction<{ index: number; ingredient: IWriteRecipeIngredientDto }>) => {
      state.showIngredientModal = true;
      state.modalType = "update";
      state.ingredientIndex = action.payload.index;
      state.currentIngredient = action.payload.ingredient;
      state.errors = undefined;
    },

    closeIngredientModal: (state) => {
      state.showIngredientModal = false;
      state.modalType = undefined;
      state.ingredientIndex = undefined;
      state.currentIngredient = defaultIngredient;
      state.errors = undefined;
    },

    setCurrentIngredient: (state, action: PayloadAction<Partial<IWriteRecipeIngredientDto>>) => {
      state.currentIngredient = {
        ...state.currentIngredient,
        ...action.payload,
      };
      state.errors = undefined;
    },

    setErrors: (state, action: PayloadAction<WriteRecipeIngredientErrors>) => {
      state.errors = action.payload;
    },
  },
});

export const { openCreateIngredientModal, openUpdateIngredientModal, closeIngredientModal, setErrors, setCurrentIngredient } = recipeSlice.actions;

export default recipeSlice.reducer;

export function useRecipeFormState() {
  const state = useStoreSelector((state) => state.mealPlanning.recipeForm);
  return state;
}

export function useRecipeFormActions() {
  const dispatch = useStoreDispatch();

  const openCreateIngredientModalCallback = () => dispatch(openCreateIngredientModal());
  const openUpdateIngredientModalCallback = (index: number, ingredient: IWriteRecipeIngredientDto) => dispatch(openUpdateIngredientModal({ index, ingredient }));
  const closeIngredientModalCallback = () => dispatch(closeIngredientModal());
  const setCurrentIngredientCallback = (ingredient: Partial<IWriteRecipeIngredientDto>) => dispatch(setCurrentIngredient(ingredient));
  const setErrorsCallback = (errors: WriteRecipeIngredientErrors) => dispatch(setErrors(errors));
  return {
    openCreateIngredientModal: openCreateIngredientModalCallback,
    openUpdateIngredientModal: openUpdateIngredientModalCallback,
    closeIngredientModal: closeIngredientModalCallback,
    setCurrentIngredient: setCurrentIngredientCallback,
    setErrors: setErrorsCallback,
  };
}
