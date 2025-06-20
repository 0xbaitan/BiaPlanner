import "../styles/IngredientInput.scss";

import { Weights, getCookingMeasurement } from "@biaplanner/shared";
import { useRecipeFormActions, useRecipeFormState } from "../../../meal-planning/reducers/RecipeFormReducer";

import Form from "react-bootstrap/Form";
import InputLabel from "@/components/forms/InputLabel";
import MeasurementInput from "./MeasurementInput";
import ProductCategoryMultiselect from "@/components/forms/ProductCategoryMultiselect";
import TextInput from "@/components/forms/TextInput";

export default function IngredientInput() {
  const { currentIngredient: ingredient, errors } = useRecipeFormState();
  const { setCurrentIngredient } = useRecipeFormActions();

  return (
    <div className="bp-ingredient_input">
      <div className="bp-ingredient_input__row">
        <TextInput
          inputLabelProps={{ required: true }}
          className="bp-ingredient_input__ingredient_title_field"
          formGroupClassName="mt-1"
          error={errors?.title?._errors[0]}
          label="Ingredient Title"
          defaultValue={ingredient.title}
          onChange={(e) => {
            setCurrentIngredient({
              title: e.target.value,
            });
          }}
        />
      </div>
      <div className="bp-ingredient_input__row">
        <div>
          <InputLabel className="bp-ingredient_input__measurement_label" required>
            Measurement
          </InputLabel>
        </div>
        <div className="bp-ingredient_input__measurement">
          <Form.Group>
            <Form.Control
              type="number"
              className="bp-ingredient_input__measurement_magnitude_field"
              placeholder="Quantity"
              min={0}
              value={ingredient.measurement?.magnitude ?? 0}
              isInvalid={Boolean(errors?.measurement?.magnitude?._errors[0])}
              onChange={(e) =>
                setCurrentIngredient({
                  measurement: {
                    magnitude: Number(e.target.value),
                    unit: ingredient.measurement?.unit ?? Weights.GRAM,
                  },
                })
              }
            />
            <Form.Control.Feedback type="invalid">{errors?.measurement?.magnitude ? errors.measurement?.magnitude._errors[0] : undefined}</Form.Control.Feedback>
          </Form.Group>
          <span className="w-100">
            <MeasurementInput
              className="bp-ingredient_input__measurement_unit_field"
              selectedValues={[getCookingMeasurement(ingredient.measurement?.unit ?? Weights.GRAM)]}
              error={errors?.measurement?.unit?._errors[0]}
              onChange={(measurements) => {
                const unit = measurements.at(0)?.unit;
                if (!unit) return;
                setCurrentIngredient({
                  measurement: {
                    unit,
                    magnitude: ingredient.measurement?.magnitude ?? 0,
                  },
                });
              }}
            />
          </span>
        </div>
      </div>
      <div className="bp-ingredient_input__row">
        <ProductCategoryMultiselect
          labelProps={{ required: true }}
          label="Choose suitable product categories that best describe this ingredient (max of 5)"
          initialValues={ingredient.productCategories}
          error={errors?.productCategories?._errors[0]}
          onSelectionChange={(productCategories) => {
            setCurrentIngredient({
              productCategories: productCategories.map((category) => ({
                id: category.id,
              })),
            });
          }}
        />
      </div>
    </div>
  );
}
