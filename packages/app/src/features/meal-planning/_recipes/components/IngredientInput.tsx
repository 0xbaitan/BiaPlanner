import "../styles/IngredientInput.scss";

import { Weights, getCookingMeasurement } from "@biaplanner/shared";
import { useRecipeFormActions, useRecipeFormState } from "../../reducers/RecipeFormReducer";

import Form from "react-bootstrap/Form";
import MeasurementInput from "./MeasurementInput";
import ProductCategoryMultiselect from "@/components/forms/ProductCategoryMultiselect";
import TextInput from "@/components/forms/TextInput";

export default function IngredientInput() {
  const { ingredient, ingredientModalErrors: errors } = useRecipeFormState();
  const { setIngredientFields } = useRecipeFormActions();

  return (
    <div className="bp-ingredient_input">
      <div className="bp-ingredient_input__row">
        <TextInput
          className="bp-ingredient_input__ingredient_title_field"
          formGroupClassName="mt-1"
          error={errors?.title?._errors[0]}
          label="Ingredient Title"
          defaultValue={ingredient.title}
          onChange={(e) => {
            setIngredientFields({
              title: e.target.value,
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
              setIngredientFields({
                measurement: {
                  magnitude: Number(e.target.value),
                  unit: ingredient.measurement?.unit ?? Weights.GRAM,
                },
              })
            }
          />
          <Form.Control.Feedback type="invalid">{errors?.measurement?.magnitude ? errors.measurement.magnitude._errors[0] : undefined}</Form.Control.Feedback>
        </Form.Group>
        <span className="w-100">
          <MeasurementInput
            className="bp-ingredient_input__measurement_unit_field"
            selectedValues={[getCookingMeasurement(ingredient.measurement?.unit ?? Weights.GRAM)]}
            error={errors?.measurement?.unit?._errors[0]}
            onChange={([{ unit }]) => {
              setIngredientFields({
                measurement: {
                  magnitude: ingredient.measurement?.magnitude ?? 0,
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
          error={errors?.productCategories?._errors[0]}
          onSelectionChange={(productCategories) => {
            setIngredientFields({
              productCategories,
            });
          }}
        />
      </div>
    </div>
  );
}
