import { IWriteRecipeDto, IWriteRecipeIngredientDto, WriteRecipeIngredientDtoSchema } from "@biaplanner/shared";
import { UseFieldArrayAppend, useFormContext } from "react-hook-form";
import { useRecipeFormActions, useRecipeFormState } from "../../reducers/RecipeFormReducer";

import Button from "react-bootstrap/Button";
import IngredientInput from "./IngredientInput";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

export type IngredientModalProps = {
  appendIngredient: (ingredient: IWriteRecipeIngredientDto) => void;
  updateIngredient: (index: number, ingredient: IWriteRecipeIngredientDto) => void;
};

export default function IngredientModal(props: IngredientModalProps) {
  const { appendIngredient, updateIngredient } = props;
  const { showIngredientModal, modalType, ingredientIndex, currentIngredient } = useRecipeFormState();
  const { closeIngredientModal, setErrors } = useRecipeFormActions();
  const formMethods = useFormContext<IWriteRecipeDto>();
  const confirmIngredient = useCallback(() => {
    if (!currentIngredient) {
      return;
    }

    const validationStatus = WriteRecipeIngredientDtoSchema.safeParse(currentIngredient);
    if (!validationStatus.success) {
      const errors = validationStatus.error.format();
      setErrors(errors);
      return;
    }

    if (modalType === "create") {
      appendIngredient(currentIngredient);
    } else if (modalType === "update" && ingredientIndex !== undefined && ingredientIndex >= 0) {
      updateIngredient(ingredientIndex, currentIngredient);
    }
    closeIngredientModal();
  }, [currentIngredient, ingredientIndex, modalType, closeIngredientModal, setErrors, appendIngredient, updateIngredient]);
  return (
    <Modal show={showIngredientModal} onHide={closeIngredientModal} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{modalType === "create" ? "Add new ingredient" : ingredientIndex !== undefined && ingredientIndex >= 0 ? `Update ingredient #${ingredientIndex + 1}` : "Update existing ingredient"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <IngredientInput />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeIngredientModal}>
          Close
        </Button>
        <Button variant="primary" onClick={confirmIngredient}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
