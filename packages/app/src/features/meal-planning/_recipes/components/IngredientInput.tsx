import "../styles/IngredientInput.scss";

import { Approximates, CookingMeasurement, IRecipeIngredient, Volumes, Weights } from "@biaplanner/shared";
import { useEffect, useReducer } from "react";

import { DeepPartial } from "react-hook-form";
import Form from "react-bootstrap/Form";
import { MdCancel } from "react-icons/md";
import MeasurementInput from "./MeasurementInput";
import ProductCategoryMultiselect from "@/components/forms/ProductCategoryMultiselect";
import TextInput from "@/components/forms/TextInput";

export type IngredientInputProps = {
  initialValue?: Partial<IRecipeIngredient>;
  onChange: (value: Partial<IRecipeIngredient>) => void;
  onRemove: () => void;
};

type PartialIngredient = Partial<Omit<IRecipeIngredient, "measurement">> & DeepPartial<Pick<IRecipeIngredient, "measurement">>;

enum IngredientInputActionType {
  UPDATE_COOKING_MEASUREMENT_MAGNITUDE = "UPDATE_COOKING_MEASUREMENT_MAGNITUDE",
  UPDATE_COOKING_MEASUREMENT_UNIT = "UPDATE_COOKING_MEASUREMENT_UNIT",
  UPDATE_OTHER_DETAILS = "UPDATE_OTHER_DETAILS",
}

export type IngredientInputActionPayload = {
  type: IngredientInputActionType;
  payload: Partial<Omit<IRecipeIngredient, "measurement">> & Partial<CookingMeasurement>;
};

const DEFAULT_INGREDIENT_VALUE: Partial<IRecipeIngredient> = {
  title: "",
  productCategories: [],
  measurement: { magnitude: 0, unit: Weights.GRAM },
};

export default function IngredientInput(props: IngredientInputProps) {
  const { initialValue, onChange, onRemove } = props;
  const [ingredient, setIngredientPartially] = useReducer(
    (state: Partial<IRecipeIngredient>, action: PartialIngredient): Partial<IRecipeIngredient> => {
      const newState: Partial<IRecipeIngredient> = {
        ...state,
        ...action,
        measurement: {
          magnitude: action.measurement?.magnitude ?? state.measurement?.magnitude ?? 0,
          unit: action.measurement?.unit ?? state.measurement?.unit ?? Weights.GRAM,
        },
      };
      return newState;
    },
    initialValue ?? (DEFAULT_INGREDIENT_VALUE as Partial<IRecipeIngredient>)
  );

  useEffect(() => {
    onChange(ingredient);
  }, [ingredient, onChange]);

  return (
    <div className="bp-ingredient_input">
      <button className="bp-ingredient_input__remove_button">
        <MdCancel size={28} onClick={onRemove} />
      </button>
      <div className="bp-ingredient_input__row">
        <TextInput
          label="Ingredient Title"
          defaultValue={initialValue?.title}
          onChange={(e) => {
            setIngredientPartially({
              title: String(e.target.value),
            });
          }}
        />
      </div>
      <div className="bp-ingredient_input__row">
        <Form.Control
          type="number"
          placeholder="Quantity"
          value={ingredient.measurement?.magnitude ?? 0}
          onChange={(e) =>
            setIngredientPartially({
              measurement: {
                magnitude: Number(e.target.value),
              },
            })
          }
        />
        <MeasurementInput
          onChange={([{ unit }]) => {
            setIngredientPartially({
              measurement: {
                unit,
              },
            });
          }}
        />
      </div>
      <div className="bp-ingredient_input__row">
        <ProductCategoryMultiselect
          label="Choose category/categories for a single ingredient"
          initialValues={initialValue?.productCategories}
          onSelectionChange={(productCategories) => {
            setIngredientPartially({
              productCategories,
            });
          }}
        />
      </div>
    </div>
  );
}
