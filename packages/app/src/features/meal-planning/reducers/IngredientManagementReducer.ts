import { IPantryItem, IRecipe, IRecipeIngredient, IWriteConcreteIngredientDto, IWritePantryItemPortionDto, Weights } from "@biaplanner/shared";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useStoreDispatch, useStoreSelector } from "@/store";

import { CookingMeasurementUnit } from "@biaplanner/shared";
import convertCookingMeasurement from "@biaplanner/shared/build/util/CookingMeasurementConversion";
import { useCallback } from "react";

export type IngredientManagementState = {
  selectedRecipe?: IRecipe;
  mappedIngredients: Record<string, ICreatePantryItemPortionExtendedDto[]>;
  showIngredientManagementOffcanvas?: boolean;
  selectedIngredient?: IRecipeIngredient;
};

export interface ICreatePantryItemPortionExtendedDto extends IWritePantryItemPortionDto {
  pantryItem: IPantryItem;
}

const initialState: IngredientManagementState = {
  selectedRecipe: undefined,
  mappedIngredients: {},
  selectedIngredient: undefined,
};

export const ingredientManagementSlice = createSlice({
  name: "ingredientManagement",
  initialState,
  reducers: {
    selectRecipe: (state, action: PayloadAction<IRecipe>) => {
      state.selectedRecipe = action.payload;
      state.mappedIngredients = {};
      state.selectedIngredient = undefined;
    },

    resetIngredientManagementForm: (state) => {
      state.mappedIngredients = {};
      state.selectedIngredient = undefined;
      state.showIngredientManagementOffcanvas = false;
      state.selectedRecipe = undefined;
    },
    deselectRecipe: (state) => {
      state.selectedRecipe = undefined;
      state.mappedIngredients = {};
      state.selectedIngredient = undefined;
      state.showIngredientManagementOffcanvas = false;
    },

    addPantryItemPortionToIngredient(state, action: PayloadAction<{ ingredientId: string; portion: ICreatePantryItemPortionExtendedDto }>) {
      const { ingredientId, portion } = action.payload;

      if (!portion.portion || portion.portion.magnitude <= 0) {
        return;
      }

      if (!Object.keys(state.mappedIngredients).includes(ingredientId)) {
        state.mappedIngredients[ingredientId] = [];
      }
      const indexOfPortionIfExists = state.mappedIngredients[ingredientId].findIndex((p) => p.pantryItemId === portion.pantryItemId);
      if (indexOfPortionIfExists !== -1) {
        state.mappedIngredients[ingredientId][indexOfPortionIfExists] = portion;
      } else {
        state.mappedIngredients[ingredientId].push(portion);
      }
    },

    removePantryItemPortionFromIngredient(state, action: PayloadAction<{ ingredientId: string; pantryItemId: string }>) {
      const { ingredientId, pantryItemId } = action.payload;
      if (!Object.keys(state.mappedIngredients).includes(ingredientId)) {
        return;
      }
      const indexOfPortion = state.mappedIngredients[ingredientId].findIndex((p) => p.pantryItemId === pantryItemId);
      if (indexOfPortion === -1) {
        return;
      }
      state.mappedIngredients[ingredientId].splice(indexOfPortion, 1);
    },

    mapIngredients: (state, action: PayloadAction<Record<string, ICreatePantryItemPortionExtendedDto[]>>) => {
      state.mappedIngredients = action.payload;
    },

    selectIngredient: (state, action: PayloadAction<IRecipeIngredient>) => {
      state.showIngredientManagementOffcanvas = true;
      state.selectedIngredient = action.payload;
    },

    deselectIngredient: (state) => {
      state.showIngredientManagementOffcanvas = false;
      state.selectedIngredient = undefined;
      console.log(state.mappedIngredients);
    },
  },
});

export const {
  selectRecipe,
  mapIngredients,
  selectIngredient,
  deselectIngredient,
  addPantryItemPortionToIngredient,
  deselectRecipe,
  removePantryItemPortionFromIngredient,
  resetIngredientManagementForm: resetMealPlanForm,
} = ingredientManagementSlice.actions;

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
  const mapIngredients = useCallback((ingredients: Record<string, ICreatePantryItemPortionExtendedDto[]>) => dispatch(ingredientManagementSlice.actions.mapIngredients(ingredients)), [dispatch]);
  return mapIngredients;
}

export function useSelectIngredient() {
  const dispatch = useStoreDispatch();
  const selectIngredient = useCallback((ingredient: IRecipeIngredient) => dispatch(ingredientManagementSlice.actions.selectIngredient(ingredient)), [dispatch]);
  return selectIngredient;
}

export function useDeselectIngredient() {
  const dispatch = useStoreDispatch();
  const deselectIngredient = useCallback(() => dispatch(ingredientManagementSlice.actions.deselectIngredient()), [dispatch]);
  return deselectIngredient;
}

export type PortionFulfilledStatus = {
  required: number;
  selected: number;
  unit: CookingMeasurementUnit;
  isFulfilled: boolean;
};
export function useGetPortionFulfilledStatus() {
  const { selectedRecipe, mappedIngredients } = useIngredientManagementState();

  const getPortionFullfilledStatus = useCallback(
    (ingredientId: string): PortionFulfilledStatus | undefined => {
      const recipeIngredient = selectedRecipe?.ingredients.find((ingredient) => ingredient.id === ingredientId);
      const required = recipeIngredient?.measurement?.magnitude ?? undefined;
      const unit = recipeIngredient?.measurement?.unit ?? Weights.GRAM;
      if (required === undefined || unit === undefined) {
        return undefined;
      }
      const selected = mappedIngredients?.[ingredientId]?.reduce((acc, curr) => acc + convertCookingMeasurement(curr.portion, unit).magnitude, 0) ?? 0;

      const isFulfilled = selected >= required;
      return { required, selected, unit, isFulfilled };
    },
    [selectedRecipe, mappedIngredients]
  );

  return getPortionFullfilledStatus;
}

export function useIngredientPantryPortionItemActions() {
  const dispatch = useStoreDispatch();
  const { mappedIngredients, selectedIngredient } = useIngredientManagementState();

  const addPantryItemPortionToIngredient = useCallback((ingredientId: string, portion: ICreatePantryItemPortionExtendedDto) => dispatch(ingredientManagementSlice.actions.addPantryItemPortionToIngredient({ ingredientId, portion })), [dispatch]);

  const removePantryItemPortionFromIngredient = useCallback((ingredientId: string, pantryItemId: string) => dispatch(ingredientManagementSlice.actions.removePantryItemPortionFromIngredient({ ingredientId, pantryItemId })), [dispatch]);

  const getSummedPortion = useCallback(
    (ingredientId: string) => {
      const targetIngredientMeasurementUnit = selectedIngredient?.measurement?.unit;
      if (!targetIngredientMeasurementUnit) {
        return {
          magnitude: 0,
          unit: Weights.GRAM,
        };
      }
      const summedPortion =
        mappedIngredients[ingredientId]?.reduce((acc, curr) => {
          if (!curr.portion) {
            return acc;
          }
          const convertedPortion = convertCookingMeasurement(curr.portion, targetIngredientMeasurementUnit);
          return acc + convertedPortion.magnitude;
        }, 0) ?? 0;
      return {
        magnitude: summedPortion,
        unit: targetIngredientMeasurementUnit,
      };
    },
    [mappedIngredients, selectedIngredient?.measurement?.unit]
  );

  const getSelectedPantryItemPortion = useCallback(
    (
      ingredientId: string,
      pantryItemId: string
    ): {
      portionMagnitude: number;
      portionUnit: CookingMeasurementUnit;
      convertedPortionMagnitude: number;
      convertedPortionUnit: CookingMeasurementUnit;
    } => {
      const targetIngredientMeasurementUnit = selectedIngredient?.measurement?.unit;
      console.log(mappedIngredients);
      const item = mappedIngredients[ingredientId]?.find((p) => p.pantryItemId === pantryItemId);
      if (!item || !item.portion) {
        return {
          portionMagnitude: 0,
          portionUnit: targetIngredientMeasurementUnit ?? Weights.GRAM,
          convertedPortionMagnitude: 0,
          convertedPortionUnit: targetIngredientMeasurementUnit ?? Weights.GRAM,
        };
      }
      const convertedPortion = convertCookingMeasurement(item.portion, targetIngredientMeasurementUnit ?? Weights.GRAM);
      console.log(item.portion, convertedPortion);
      return {
        portionMagnitude: item.portion.magnitude,
        portionUnit: item.portion.unit,
        convertedPortionMagnitude: convertedPortion.magnitude,
        convertedPortionUnit: convertedPortion.unit,
      };
    },
    [mappedIngredients, selectedIngredient?.measurement?.unit]
  );

  const selectRecipe = useSelectRecipe();

  return { addPantryItemPortionToIngredient, removePantryItemPortionFromIngredient, getSummedPortion, getSelectedPantryItemPortion, selectRecipe };
}

export function useSelectedPantryItems(ingredientId: string) {
  const { mappedIngredients } = useIngredientManagementState();
  const selectedPantryItems =
    mappedIngredients[ingredientId]?.filter((item) => {
      if (!item.portion) {
        return false;
      }
      return item.portion.magnitude > 0;
    }) ?? [];

  return selectedPantryItems;
}

export function useConfirmedIngredients() {
  const { mappedIngredients } = useIngredientManagementState();
  const confirmedIngredients: IWriteConcreteIngredientDto[] = Object.entries(mappedIngredients).map(([ingredientId, portions]) => {
    return {
      ingredientId,
      pantryItemsWithPortions: portions,
      concreteRecipeId: undefined,
      id: undefined,
    };
  });
  return confirmedIngredients;
}

export function useResetIngredientManagementForm() {
  const dispatch = useStoreDispatch();
  const resetMealPlanForm = useCallback(() => dispatch(ingredientManagementSlice.actions.resetIngredientManagementForm()), [dispatch]);
  return resetMealPlanForm;
}
