import { CookingMeasurement, CookingMeasurementUnit, IConcreteRecipe, IRecipe, IRecipeIngredient, IWriteConcreteRecipeDto, IWritePantryItemPortionDto, MealTypes, Weights } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useCallback, useMemo } from "react";
import { useStoreDispatch, useStoreSelector } from "@/store";

import convertCookingMeasurement from "@biaplanner/shared/build/util/CookingMeasurementConversion";
import dayjs from "dayjs";

export type MealPlanFormState = {
  selectedRecipe?: IRecipe;
  isRecipeOffcanvasVisible: boolean;
  isIngredientManagementOffcanvasVisible: boolean;
  initialMealPlan?: IConcreteRecipe;
  formValue: IWriteConcreteRecipeDto;
  disableRecipeSelection: boolean;
  selectedIngredient?: IRecipeIngredient;
};

export const initialFormValue: IWriteConcreteRecipeDto = {
  recipeId: "",
  mealType: MealTypes.BREAKFAST,
  planDate: dayjs().format("YYYY-MM-DD"),
  confirmedIngredients: [],
};

export const initialState: MealPlanFormState = {
  isIngredientManagementOffcanvasVisible: false,
  selectedRecipe: undefined,
  isRecipeOffcanvasVisible: false,
  initialMealPlan: undefined,
  formValue: initialFormValue,
  selectedIngredient: undefined,
  disableRecipeSelection: false,
};

export type UpdatePortionToIngredientPayload = {
  ingredientId: string;
  pantryItemId: string;
  portion: CookingMeasurement;
};

export const mealPlanSlice = createSlice({
  name: "mealPlanForm",
  initialState,
  reducers: {
    resetForm: (state) => {
      state.formValue = initialFormValue;
      state.selectedRecipe = undefined;
      state.isRecipeOffcanvasVisible = false;
      state.initialMealPlan = undefined;
      state.selectedIngredient = undefined;
      state.disableRecipeSelection = false;
      state.isIngredientManagementOffcanvasVisible = false;
    },
    // Recipe Management
    showRecipeSelectionOffcanvas: (state) => {
      state.isRecipeOffcanvasVisible = true;
    },
    hideRecipeSelectionOffcanvas: (state) => {
      state.isRecipeOffcanvasVisible = false;
    },
    selectRecipe: (state, action: PayloadAction<IRecipe>) => {
      state.selectedRecipe = action.payload;
      state.isRecipeOffcanvasVisible = false;
      state.formValue.recipeId = action.payload.id;
      state.selectedIngredient = undefined;
      state.formValue.confirmedIngredients = action.payload.ingredients.map((ingredient) => ({
        ingredientId: ingredient.id,
        pantryItemsWithPortions: [],
      }));
    },
    initialiseForm: (state, action: PayloadAction<IConcreteRecipe>) => {
      const { recipeId, numberOfServings, mealType, planDate, confirmedIngredients } = action.payload;
      state.formValue = {
        recipeId,
        numberOfServings,
        mealType,
        planDate: planDate ? dayjs(planDate).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
        confirmedIngredients: confirmedIngredients
          .filter((ingredient) => ingredient.ingredientId !== undefined && ingredient.concreteRecipeId !== undefined && ingredient.id !== undefined)
          .map((concreteIngredient) => ({
            ingredientId: concreteIngredient.ingredientId as string,
            concreteRecipeId: concreteIngredient.concreteRecipeId as string,
            id: concreteIngredient.id as string,
            pantryItemsWithPortions: concreteIngredient.pantryItemsWithPortions?.map((item) => ({
              pantryItemId: item.pantryItemId,
              portion: {
                magnitude: item.portion?.magnitude ?? 0,
                unit: item.portion?.unit ?? Weights.GRAM,
              },
              id: item.id,
            })),
          })),
      };
      state.initialMealPlan = action.payload;
      state.selectedRecipe = action.payload.recipe;
      state.selectedIngredient = undefined;
      state.isRecipeOffcanvasVisible = false;
      state.disableRecipeSelection = true;
    },

    setFormValue: (state, action: PayloadAction<Partial<IWriteConcreteRecipeDto>>) => {
      const { recipeId, numberOfServings, mealType, planDate } = action.payload;
      if (recipeId) {
        state.formValue.recipeId = recipeId;
      }

      if (numberOfServings) {
        state.formValue.numberOfServings = numberOfServings;
      }

      if (mealType) {
        state.formValue.mealType = mealType;
      }

      if (planDate) {
        state.formValue.planDate = dayjs(planDate).format("YYYY-MM-DD");
      }
    },

    setDisableRecipeSelection: (state, action: PayloadAction<boolean>) => {
      state.disableRecipeSelection = action.payload;
    },

    // Ingredient Management
    showIngredientManagementOffcanvas: (state, action: PayloadAction<IRecipeIngredient>) => {
      state.isIngredientManagementOffcanvasVisible = true;
      state.selectedIngredient = action.payload;
    },

    hideIngredientManagementOffcanvas: (state) => {
      state.isIngredientManagementOffcanvasVisible = false;
      state.selectedIngredient = undefined;
    },

    addOrUpdatePortionIngredient: (state, action: PayloadAction<UpdatePortionToIngredientPayload>) => {
      const { ingredientId, pantryItemId, portion } = action.payload;
      if (!state.formValue.confirmedIngredients) {
        state.formValue.confirmedIngredients = [];
      }

      const ingredient = state.formValue.confirmedIngredients.find((ingredient) => ingredient.ingredientId === ingredientId);
      if (!ingredient) {
        state.formValue.confirmedIngredients.push({
          ingredientId,
          pantryItemsWithPortions: [],
        });
      }

      const ingredientIndex = state.formValue.confirmedIngredients.findIndex((ingredient) => ingredient.ingredientId === ingredientId);

      const pantryItemIndex = ingredient?.pantryItemsWithPortions?.findIndex((item) => item.pantryItemId === pantryItemId) ?? -1;

      if (pantryItemIndex !== -1) {
        state.formValue.confirmedIngredients[ingredientIndex].pantryItemsWithPortions![pantryItemIndex] = {
          ...state.formValue.confirmedIngredients[ingredientIndex].pantryItemsWithPortions![pantryItemIndex],
          pantryItemId,
          portion: {
            magnitude: portion.magnitude,
            unit: portion.unit,
          },
        };
      } else {
        state.formValue.confirmedIngredients[ingredientIndex].pantryItemsWithPortions?.push({
          pantryItemId,
          portion: {
            magnitude: portion.magnitude,
            unit: portion.unit,
          },
          id: undefined,
        });
      }
    },

    removePortionIngredient: (state, action: PayloadAction<{ ingredientId: string; pantryItemId: string }>) => {
      const { ingredientId, pantryItemId } = action.payload;
      if (!state.formValue.confirmedIngredients) {
        state.formValue.confirmedIngredients = [];
      }
      const ingredient = state.formValue.confirmedIngredients.find((ingredient) => ingredient.ingredientId === ingredientId);
      if (ingredient) {
        const pantryItemIndex = ingredient.pantryItemsWithPortions?.findIndex((item) => item.pantryItemId === pantryItemId) ?? -1;
        if (pantryItemIndex !== -1) {
          ingredient.pantryItemsWithPortions?.splice(pantryItemIndex, 1);
        }
      }
    },
  },
});

export const mealPlanActions = mealPlanSlice.actions;
export default mealPlanSlice.reducer;
export type MealPlanFormAction = typeof mealPlanSlice.actions;

export function useMealPlanFormState() {
  return useStoreSelector((state) => state.mealPlanning.mealPlanForm);
}

export function useMealPlanFormActions() {
  const dispatch = useStoreDispatch();
  const { formValue, initialMealPlan } = useMealPlanFormState();

  const resetForm = useCallback(() => {
    dispatch(mealPlanActions.resetForm());
  }, [dispatch]);

  const showRecipeSelectionOffcanvas = useCallback(() => {
    dispatch(mealPlanActions.showRecipeSelectionOffcanvas());
  }, [dispatch]);

  const hideRecipeSelectionOffcanvas = useCallback(() => {
    dispatch(mealPlanActions.hideRecipeSelectionOffcanvas());
  }, [dispatch]);

  const selectRecipe = useCallback(
    (recipe: IRecipe) => {
      dispatch(mealPlanActions.selectRecipe(recipe));
    },
    [dispatch]
  );

  const initialiseForm = useCallback(
    (mealPlan: IConcreteRecipe) => {
      dispatch(mealPlanActions.initialiseForm(mealPlan));
    },
    [dispatch]
  );

  const setFormValue = useCallback(
    (formValue: Partial<IWriteConcreteRecipeDto>) => {
      dispatch(mealPlanActions.setFormValue(formValue));
    },
    [dispatch]
  );

  const setDisableRecipeSelection = useCallback(
    (disable: boolean) => {
      dispatch(mealPlanActions.setDisableRecipeSelection(disable));
    },
    [dispatch]
  );

  const showIngredientManagementOffcanvas = useCallback(
    (ingredient: IRecipeIngredient) => {
      dispatch(mealPlanActions.showIngredientManagementOffcanvas(ingredient));
    },
    [dispatch]
  );

  const hideIngredientManagementOffcanvas = useCallback(() => {
    dispatch(mealPlanActions.hideIngredientManagementOffcanvas());
  }, [dispatch]);

  const addOrUpdatePortionIngredient = useCallback(
    (payload: UpdatePortionToIngredientPayload) => {
      dispatch(mealPlanActions.addOrUpdatePortionIngredient(payload));
    },
    [dispatch]
  );

  const removePortionIngredient = useCallback(
    (payload: { ingredientId: string; pantryItemId: string }) => {
      dispatch(mealPlanActions.removePortionIngredient(payload));
    },
    [dispatch]
  );

  const checkIfIngredientExists = useCallback(
    (ingredientId: string) => {
      const ingredient = formValue.confirmedIngredients?.find((ingredient) => ingredient.ingredientId === ingredientId);
      return !!ingredient;
    },
    [formValue.confirmedIngredients]
  );

  const getPantryItemPortions = useCallback(
    (ingredientId: string) => {
      const ingredient = formValue.confirmedIngredients?.find((ingredient) => ingredient.ingredientId === ingredientId);
      if (!ingredient) {
        return [];
      }

      const portions: IWritePantryItemPortionDto[] =
        ingredient.pantryItemsWithPortions
          ?.filter((item) => item.pantryItemId !== undefined)
          .map((item) => ({
            pantryItemId: item.pantryItemId,
            portion: {
              magnitude: item.portion?.magnitude ?? 0,
              unit: item.portion?.unit,
            },
            id: item.id,
          })) ?? [];

      return portions;
    },
    [formValue.confirmedIngredients]
  );

  const getSummedPortion = useCallback(
    (ingredientId: string, ingredientUnit: CookingMeasurementUnit): CookingMeasurement => {
      const portions = getPantryItemPortions(ingredientId);

      if (!portions || portions.length === 0) {
        return {
          magnitude: 0,
          unit: ingredientUnit,
        };
      }

      let totalMagnitude: number = 0;

      portions.forEach((mapping) => {
        const converted = convertCookingMeasurement(mapping.portion, ingredientUnit);
        totalMagnitude += converted.magnitude;
      });

      return {
        magnitude: totalMagnitude,
        unit: ingredientUnit,
      };
    },

    [getPantryItemPortions]
  );

  const getPortionFulfilledStatus = useCallback(
    (ingredient: IRecipeIngredient) => {
      if (!ingredient.measurement) {
        return null;
      }
      const selectedPortion = getSummedPortion(ingredient.id, ingredient.measurement?.unit);
      const requiredPortion = ingredient.measurement;

      const convertedSelectedPortion = convertCookingMeasurement(selectedPortion, requiredPortion.unit);

      const isFulfilled = convertedSelectedPortion.magnitude >= requiredPortion.magnitude;

      const isOverfulfilled = convertedSelectedPortion.magnitude > requiredPortion.magnitude;

      const remainingPortion = {
        magnitude: Math.min(Math.max(requiredPortion.magnitude - convertedSelectedPortion.magnitude, 0), requiredPortion.magnitude),
        unit: convertedSelectedPortion.unit,
      };
      return {
        isFulfilled,
        isOverfulfilled,
        selectedPortion: convertedSelectedPortion,
        requiredPortion,
        remainingPortion,
      };
    },
    [getSummedPortion]
  );

  const getPortion = useCallback(
    (pantryItemId: string, ingredientId: string) => {
      console.log(formValue.confirmedIngredients ?? "No confirmed ingredients");
      const portions = getPantryItemPortions(ingredientId);
      const pantryItem = portions.find((item) => item.pantryItemId === pantryItemId);
      if (!pantryItem) {
        console.warn("No pantry item found");
        return {
          magnitude: 0,
          unit: Weights.GRAM,
        };
      }
      const portion = pantryItem.portion;
      if (!portion) {
        console.warn("No portion found");
        return {
          magnitude: 0,
          unit: Weights.GRAM,
        };
      }
      return {
        magnitude: portion.magnitude,
        unit: portion.unit ?? Weights.GRAM,
      };
    },
    [formValue.confirmedIngredients, getPantryItemPortions]
  );

  const getSelectedPantryItemPortions = useCallback(
    (ingredientId: string) => {
      const ingredient = formValue.confirmedIngredients?.find((ingredient) => ingredient.ingredientId === ingredientId);
      if (!ingredient) {
        return [];
      }

      const selectedPantryItems: IWritePantryItemPortionDto[] =
        ingredient.pantryItemsWithPortions
          ?.filter((item) => item.pantryItemId !== undefined)
          .map((item) => ({
            pantryItemId: item.pantryItemId,
            portion: {
              magnitude: item.portion?.magnitude ?? 0,
              unit: item.portion?.unit,
            },
            id: item.id,
          })) ?? [];

      return selectedPantryItems;
    },
    [formValue.confirmedIngredients]
  );

  const getAlreadyReservedPortion = useCallback(
    (ingredientId: string, pantryId: string) => {
      const concreteIngredient = initialMealPlan?.confirmedIngredients.find((ingredient) => ingredient.ingredientId === ingredientId);
      if (!concreteIngredient) {
        return undefined;
      }

      const pantryItem = concreteIngredient.pantryItemsWithPortions?.find((item) => item.pantryItemId === pantryId);

      if (!pantryItem?.portion) {
        return undefined;
      }

      return {
        magnitude: pantryItem.portion.magnitude,
        unit: pantryItem.portion.unit,
      };
    },
    [initialMealPlan]
  );

  return {
    resetForm,
    showRecipeSelectionOffcanvas,
    hideRecipeSelectionOffcanvas,
    selectRecipe,
    initialiseForm,
    setFormValue,
    setDisableRecipeSelection,
    showIngredientManagementOffcanvas,
    hideIngredientManagementOffcanvas,
    addOrUpdatePortionIngredient,
    removePortionIngredient,
    checkIfIngredientExists,
    getPantryItemPortions,
    getSummedPortion,
    getPortionFulfilledStatus,
    getPortion,
    getSelectedPantryItemPortions,
    getAlreadyReservedPortion,
  };
}

export function useExtendedMealPlanFormState() {
  const mealPlanFormState = useMealPlanFormState();
  const { formValue, selectedIngredient } = mealPlanFormState;

  const selectedPantryItems: IWritePantryItemPortionDto[] = useMemo(
    () => formValue.confirmedIngredients?.find((ingredient) => ingredient.ingredientId === selectedIngredient?.id)?.pantryItemsWithPortions ?? [],
    [formValue.confirmedIngredients, selectedIngredient]
  );

  return {
    ...mealPlanFormState,
    selectedPantryItems,
  };
}
