import { IRecipeIngredient, IWriteRecipeIngredientDto } from "@biaplanner/shared";
import { useRecipeFormActions, useRecipeFormState } from "../../reducers/RecipeFormReducer";

import Button from "react-bootstrap/Button";
import { DeepPartial } from "utility-types";
import { FaTrash } from "react-icons/fa6";
import IngredientInput from "./IngredientInput";
import { MdEdit } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";

export default function IngredientModal() {
  const { showIngredientModal, ingredientModalType, ingredientIndex } = useRecipeFormState();
  const { closeIngredientModal, confirmIngredient } = useRecipeFormActions();

  return (
    <Modal show={showIngredientModal} onHide={closeIngredientModal} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{ingredientModalType === "create" ? "Add new ingredient" : ingredientIndex !== undefined && ingredientIndex >= 0 ? `Update ingredient #${ingredientIndex + 1}` : "Update existing ingredient"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <IngredientInput />

        {/* /> */}
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
