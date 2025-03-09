import IngredientInput, { IngredientInputErrorState } from "./IngredientInput";
import { useCloseIngredientModal, useConfirmedIngredientsState, useRecipeFormState } from "../../reducers/RecipeFormReducer";

import Button from "react-bootstrap/Button";
import { DeepPartial } from "utility-types";
import { IRecipeIngredient } from "@biaplanner/shared";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";
import { useState } from "react";

function useVerifyIngredient() {
  return useCallback((ingredient: DeepPartial<IRecipeIngredient>) => {
    const errors: IngredientInputErrorState = {
      measurement: {},
    };

    if (!ingredient.title || typeof ingredient.title !== "string" || ingredient.title.trim().length === 0) {
      errors.title = "Title is required";
    }

    if (!ingredient.measurement?.magnitude || isNaN(ingredient.measurement.magnitude) || ingredient.measurement.magnitude <= 0) {
      errors.measurement = {
        ...errors.measurement,
        magnitude: "Magnitude is required",
      };
    }
    console.log(ingredient.measurement?.unit);
    if (!ingredient.measurement?.unit) {
      errors.measurement = {
        ...errors.measurement,
        unit: "Unit is required",
      };
    }

    if (!ingredient.productCategories?.length || ingredient.productCategories.length === 0) {
      errors.productCategories = "Product category is required";
    }

    if (errors.title || errors.measurement.magnitude || errors.measurement.unit || errors.productCategories) {
      return errors;
    }

    return null;
  }, []);
}

export default function IngredientModal() {
  const { showIngredientModal, ingredientModalType, ingredientIndex, ingredient: stationedIngredient } = useRecipeFormState();
  console.log(ingredientModalType);
  const closeIngredientModal = useCloseIngredientModal();
  const [errors, setErrors] = useState<IngredientInputErrorState>();
  const [ingredient, setIngredient] = useState<DeepPartial<IRecipeIngredient>>({});
  const verifyIngredient = useVerifyIngredient();
  const { insertIngredient, updateIngredient } = useConfirmedIngredientsState();
  const onConfirmIngredient = useCallback(() => {
    const errors = verifyIngredient(ingredient);
    console.log(ingredientIndex, ingredient);
    if (errors) {
      setErrors(errors);
      return;
    }
    if (ingredientModalType === "create") {
      insertIngredient(ingredient);
    } else if (ingredientIndex !== undefined && ingredientModalType === "update") {
      updateIngredient(ingredientIndex, ingredient);
    }
    closeIngredientModal();
  }, [closeIngredientModal, ingredient, ingredientIndex, ingredientModalType, insertIngredient, updateIngredient, verifyIngredient]);

  return (
    <Modal show={showIngredientModal} onHide={closeIngredientModal} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{ingredientModalType === "create" ? "Add new ingredient" : ingredientIndex !== undefined && ingredientIndex >= 0 ? `Update ingredient #${ingredientIndex + 1}` : "Update existing ingredient"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <IngredientInput
          initialValue={stationedIngredient as Partial<IRecipeIngredient>}
          errors={errors}
          onChange={(ingredient) => {
            setIngredient(ingredient);
          }}
        />

        {/* /> */}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeIngredientModal}>
          Close
        </Button>
        <Button variant="primary" onClick={onConfirmIngredient}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
