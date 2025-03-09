import "../styles/IngredientInput.scss";

import { CookingMeasurement, IRecipeIngredient, Weights, getCookingMeasurement } from "@biaplanner/shared";
import { useEffect, useReducer } from "react";

import { DeepPartial } from "react-hook-form";
import Form from "react-bootstrap/Form";
import MeasurementInput from "./MeasurementInput";
import ProductCategoryMultiselect from "@/components/forms/ProductCategoryMultiselect";
import TextInput from "@/components/forms/TextInput";

export type IngredientInputProps = {
  initialValue?: Partial<IRecipeIngredient>;
  onChange: (value: Partial<IRecipeIngredient>) => void;
  errors?: IngredientInputErrorState;
};

type PartialIngredient = Partial<Omit<IRecipeIngredient, "measurement">> & DeepPartial<Pick<IRecipeIngredient, "measurement">>;

export type IngredientInputErrorState = {
  title?: string;
  measurement: {
    magnitude?: string;
    unit?: string;
  };
  productCategories?: string;
};

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
  const { initialValue, onChange, errors } = props;
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
      <div className="bp-ingredient_input__row">
        <TextInput
          className="bp-ingredient_input__ingredient_title_field"
          formGroupClassName="mt-1"
          error={errors?.title}
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
        <Form.Group>
          <Form.Control
            type="number"
            className="bp-ingredient_input__measurement_magnitude_field"
            placeholder="Quantity"
            value={ingredient.measurement?.magnitude ?? 0}
            isInvalid={Boolean(errors?.measurement?.magnitude)}
            onChange={(e) =>
              setIngredientPartially({
                measurement: {
                  magnitude: Number(e.target.value),
                },
              })
            }
          />
          <Form.Control.Feedback type="invalid">{errors?.measurement?.magnitude}</Form.Control.Feedback>
        </Form.Group>
        <span className="w-100">
          <MeasurementInput
            className="bp-ingredient_input__measurement_unit_field"
            selectedValues={[getCookingMeasurement(ingredient.measurement?.unit ?? Weights.GRAM)]}
            error={errors?.measurement?.magnitude}
            onChange={([{ unit }]) => {
              setIngredientPartially({
                measurement: {
                  unit,
                },
              });
            }}
          />
        </span>
      </div>
      <div className="bp-ingredient_input__row">
        <ProductCategoryMultiselect
          label="Choose category/categories for a single ingredient"
          initialValues={initialValue?.productCategories}
          error={errors?.productCategories}
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
