import {
  DifficultyLevels,
  IRecipe,
  IRecipeIngredient,
  IWriteRecipeDto,
  IWriteRecipeIngredientDto,
  Weights,
  WriteRecipeFormattedErrors,
  WriteRecipeIngredientDtoSchema,
  WriteRecipeIngredientErrors,
  WriteRecipeValidationSchema,
} from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { DeepPartial } from "utility-types";
import { clear } from "console";
import { resetFormState } from "@/features/shopping-lists/reducers/MarkShoppingDoneReducer";
import { useCallback } from "react";
import { z } from "zod";

export type RecipeFormState = {
  showIngredientModal: boolean;
  ingredientModalType?: "create" | "update";
  ingredientIndex?: number;
  ingredient: IWriteRecipeIngredientDto;
  formValues: IWriteRecipeDto;
  formErrors?: WriteRecipeFormattedErrors;
  ingredientModalErrors?: WriteRecipeIngredientErrors;
};

const initialFormValues: IWriteRecipeDto = {
  ingredients: [],
  title: "",
  description: "",
  instructions: "",
  difficultyLevel: DifficultyLevels.EASY,
  cuisine: { id: "" },
  prepTime: {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  cookingTime: {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  tags: [],
};
const initialIngredient: IWriteRecipeIngredientDto = {
  id: "",
  title: "",
  measurement: {
    unit: Weights.GRAM,
    magnitude: 0,
  },
  productCategories: [],
};
const initialState: RecipeFormState = {
  formValues: initialFormValues,
  showIngredientModal: false,
  ingredient: {
    ...initialIngredient,
  },

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
    resetRecipeFormState: (state) => {
      state.formValues = initialFormValues;
      state.showIngredientModal = false;
      state.ingredientModalType = undefined;
      state.ingredientIndex = undefined;
      state.ingredient = initialIngredient;
      state.formErrors = undefined;
      state.ingredientModalErrors = undefined;
    },

    setFormErrors: (state, action: PayloadAction<WriteRecipeFormattedErrors>) => {
      state.formErrors = action.payload;
    },

    clearFormErrors: (state) => {
      state.formErrors = undefined;
    },

    setFields: (state, action: PayloadAction<Partial<IWriteRecipeDto>>) => {
      const values = action.payload;
      state.formValues = {
        ...state.formValues,
        ...values,
      };
    },

    setFormValues: (state, action: PayloadAction<IRecipe>) => {
      const recipe = action.payload;
      state.formValues = {
        ...state.formValues,
        cuisine: { id: recipe.cuisine.id },
        description: recipe.description,
        difficultyLevel: recipe.difficultyLevel,
        ingredients: recipe.ingredients.map((ingredient) => ({
          title: ingredient.title!,
          id: ingredient.id,
          productCategories: ingredient.productCategories.map((category) => ({ id: category.id })),
          measurement: ingredient.measurement!,
          recipeId: recipe.id,
        })),
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        cookingTime: recipe.cookingTime,
        tags: recipe.tags?.map((tag) => ({ id: tag.id })) || [],
        title: recipe.title,
      };
    },

    openCreateIngredientModal: (state) => {
      state.showIngredientModal = true;
      state.ingredientModalType = "create";
      state.ingredientIndex = undefined;

      state.ingredient = initialIngredient;
    },

    setIngredientFields: (state, action: PayloadAction<Partial<IWriteRecipeIngredientDto>>) => {
      const values = action.payload;
      state.ingredient = {
        ...state.ingredient,
        ...values,
      };
    },
    openUpdateIngredientModal: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const ingredient = state.formValues.ingredients.at(index);
      if (!ingredient) {
        closeIngredientModal();
        return;
      }
      state.showIngredientModal = true;
      state.ingredientModalType = "update";
      state.ingredientIndex = index;
      state.ingredient = ingredient;
    },

    closeIngredientModal: (state) => {
      state.showIngredientModal = false;
      state.ingredientModalType = undefined;
      state.ingredientIndex = undefined;
      state.ingredient = initialIngredient;
    },
    insertIngredient: (state, action: PayloadAction<IWriteRecipeIngredientDto>) => {
      state.formValues.ingredients = [...state.formValues.ingredients, action.payload];
    },
    updateIngredient: (state, action: PayloadAction<{ index: number; ingredient: IWriteRecipeIngredientDto }>) => {
      state.formValues.ingredients[action.payload.index] = action.payload.ingredient;
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.formValues.ingredients.splice(action.payload, 1);
    },

    setIngredientModalErrors: (state, action: PayloadAction<WriteRecipeIngredientErrors>) => {
      state.ingredientModalErrors = action.payload;
    },

    clearIngredientModalErrors: (state) => {
      state.ingredientModalErrors = undefined;
    },
  },
});

export const {
  openCreateIngredientModal,
  openUpdateIngredientModal,
  closeIngredientModal,
  insertIngredient,
  updateIngredient,
  clearIngredientModalErrors,
  setIngredientModalErrors,
  setFields,
  removeIngredient,
  setFormValues: setFormState,
  resetRecipeFormState,
  setFormErrors,
  setIngredientFields,
  clearFormErrors,
} = recipeSlice.actions;

export default recipeSlice.reducer;
export type MealPlanFormAction = typeof recipeSlice.actions;

export function useRecipeFormState(): RecipeFormState {
  return useStoreSelector((state) => state.mealPlanning.recipeForm);
}

export function useRecipeFormActions() {
  const { ingredientModalType, ingredientIndex, ingredient } = useRecipeFormState();
  const dispatch = useStoreDispatch();
  const resetFormCallback = useCallback(() => {
    dispatch(resetRecipeFormState());
  }, [dispatch]);

  const setFormValuesCallback = useCallback(
    (recipe: IRecipe) => {
      dispatch(setFormState(recipe));
    },
    [dispatch]
  );

  const closeIngredientModalCallback = useCallback(() => {
    dispatch(closeIngredientModal());
  }, [dispatch]);

  const openCreateIngredientModalCallback = useCallback(() => {
    dispatch(openCreateIngredientModal());
  }, [dispatch]);

  const openUpdateIngredientModalCallback = useCallback(
    (index: number) => {
      dispatch(openUpdateIngredientModal(index));
    },
    [dispatch]
  );

  const insertIngredientCallback = useCallback(
    (ingredient: IWriteRecipeIngredientDto) => {
      dispatch(insertIngredient(ingredient));
    },
    [dispatch]
  );

  const updateIngredientCallback = useCallback(
    (payload: { index: number; ingredient: IWriteRecipeIngredientDto }) => {
      dispatch(updateIngredient(payload));
    },
    [dispatch]
  );

  const removeIngredientCallback = useCallback(
    (index: number) => {
      dispatch(removeIngredient(index));
    },
    [dispatch]
  );

  const setFormErrorsCallback = useCallback(
    (errors: WriteRecipeFormattedErrors) => {
      dispatch(setFormErrors(errors));
    },
    [dispatch]
  );

  const clearFormErrorsCallback = useCallback(() => {
    dispatch(clearFormErrors());
  }, [dispatch]);

  const resetFormStateCallback = useCallback(() => {
    dispatch(resetRecipeFormState());
  }, [dispatch]);

  const setIngredientModalErrorsCallback = useCallback(
    (errors: WriteRecipeIngredientErrors) => {
      dispatch(setIngredientModalErrors(errors));
    },
    [dispatch]
  );

  const clearIngredientModalErrorsCallback = useCallback(() => {
    dispatch(clearIngredientModalErrors());
  }, [dispatch]);

  const setFieldsCallback = useCallback(
    (values: Partial<IWriteRecipeDto>) => {
      dispatch(setFields(values));
    },
    [dispatch]
  );

  const setIngredientFieldsCallback = useCallback(
    (values: Partial<IWriteRecipeIngredientDto>) => {
      dispatch(setIngredientFields(values));
    },
    [dispatch]
  );

  const validateFormCallback = useCallback(
    (formValues: IWriteRecipeDto) => {
      const validationResult = WriteRecipeValidationSchema.safeParse(formValues);
      if (!validationResult.success) {
        const errors: WriteRecipeFormattedErrors = validationResult.error.format();
        dispatch(setFormErrors(errors));
        return false;
      }
      return true;
    },
    [dispatch]
  );

  const validateIngredientCallback = useCallback(
    (ingredient: IWriteRecipeIngredientDto) => {
      const validationResult = WriteRecipeIngredientDtoSchema.safeParse(ingredient);
      if (!validationResult.success) {
        const errors: WriteRecipeIngredientErrors = validationResult.error.format();
        dispatch(setIngredientModalErrors(errors));
        return false;
      }
      return true;
    },
    [dispatch]
  );

  const confirmIngredient = useCallback(() => {
    const validationResult = validateIngredientCallback(ingredient);
    if (!validationResult) {
      return;
    }
    if (ingredientModalType === "create") {
      insertIngredientCallback(ingredient);
    } else if (ingredientIndex !== undefined && ingredientModalType === "update") {
      updateIngredientCallback({ index: ingredientIndex, ingredient });
    }
    closeIngredientModalCallback();
    clearIngredientModalErrorsCallback();
  }, [validateIngredientCallback, ingredient, ingredientModalType, ingredientIndex, closeIngredientModalCallback, clearIngredientModalErrorsCallback, insertIngredientCallback, updateIngredientCallback]);

  return {
    resetForm: resetFormCallback,
    setFormValues: setFormValuesCallback,
    closeIngredientModal: closeIngredientModalCallback,
    openCreateIngredientModal: openCreateIngredientModalCallback,
    openUpdateIngredientModal: openUpdateIngredientModalCallback,
    insertIngredient: insertIngredientCallback,
    updateIngredient: updateIngredientCallback,
    removeIngredient: removeIngredientCallback,
    setFormErrors: setFormErrorsCallback,
    clearFormErrors: clearFormErrorsCallback,
    resetFormState: resetFormStateCallback,
    setIngredientModalErrors: setIngredientModalErrorsCallback,
    clearIngredientModalErrors: clearIngredientModalErrorsCallback,
    validateForm: validateFormCallback,
    validateIngredient: validateIngredientCallback,
    setFields: setFieldsCallback,
    setIngredientFields: setIngredientFieldsCallback,
    confirmIngredient,
  };
}
