import { Approximates, ICookingMeasurement, IRecipeIngredient, Volumes, Weights } from "@biaplanner/shared";
import { useEffect, useReducer } from "react";

import Form from "react-bootstrap/Form";
import MeasurementInput from "./MeasurementInput";
import { PayloadAction } from "@reduxjs/toolkit";
import ProductCategoryMultiselect from "@/components/forms/ProductCategoryMultiselect";

export type IngredientInputProps = {
  initialValue?: Partial<IRecipeIngredient>;
  onChange: (value: Partial<IRecipeIngredient>) => void;
};

export type IngredientInputState = Partial<IRecipeIngredient>;
export type IngredientInputAction = {
  type: "UPDATE_PRODUCT_CATEGORIES" | "UPDATE_QUANTITY" | "UPDATE_UNIT";
  payload: Partial<IRecipeIngredient & Pick<ICookingMeasurement, "type" | "unit">>;
};

function RecipeIngredientReducer(state: IngredientInputState, action: IngredientInputAction): Partial<IRecipeIngredient> {
  switch (action.type) {
    case "UPDATE_PRODUCT_CATEGORIES":
      return { ...state, productCategories: action.payload.productCategories };
    case "UPDATE_QUANTITY":
      return { ...state, quantity: action.payload.quantity };
    case "UPDATE_UNIT":
      if (action.payload.type === "weight") {
        return { ...state, weightUnit: action.payload.unit as Weights, volumeUnit: null, approximateUnit: null };
      } else if (action.payload.type === "volume") {
        return { ...state, weightUnit: null, volumeUnit: action.payload.unit as Volumes, approximateUnit: null };
      } else if (action.payload.type === "approximate") {
        return { ...state, weightUnit: null, volumeUnit: null, approximateUnit: action.payload.unit as Approximates };
      } else {
        return state;
      }
    default:
      return state;
  }
}

export default function IngredientInput(props: IngredientInputProps) {
  const { initialValue, onChange } = props;
  const [ingredient, setIngredient] = useReducer((state: IngredientInputState, action: IngredientInputAction) => RecipeIngredientReducer(state, action), initialValue ?? {});

  useEffect(() => {
    onChange(ingredient);
  }, [ingredient, onChange]);

  return (
    <>
      <ProductCategoryMultiselect
        label="Choose category/categories for a single ingredient"
        initialValues={initialValue?.productCategories}
        onSelectionChange={(productCategories) => {
          setIngredient({ type: "UPDATE_PRODUCT_CATEGORIES", payload: { productCategories } });
        }}
      />
      <Form.Control type="number" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => setIngredient({ type: "UPDATE_QUANTITY", payload: { quantity: parseInt(e.target.value) } })} />
      <MeasurementInput
        onChange={([unit]) => {
          setIngredient({
            type: "UPDATE_UNIT",
            payload: {
              unit: unit.unit,
              type: unit.type,
            },
          });
        }}
      />
    </>
  );
}
