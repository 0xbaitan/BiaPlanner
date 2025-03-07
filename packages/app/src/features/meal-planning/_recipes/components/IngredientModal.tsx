import { useRecipeFormState, useSetShowIngredientModal } from "../../reducers/RecipeFormReducer";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useCallback } from "react";

export default function IngredientModal() {
  const { showIngredientModal } = useRecipeFormState();
  const setShowIngredientModal = useSetShowIngredientModal();
  const handleClose = useCallback(() => setShowIngredientModal(false), [setShowIngredientModal]);

  return (
    <Modal show={showIngredientModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Modal body text goes here.</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary">Close</Button>
        <Button variant="primary">Save changes</Button>
      </Modal.Footer>
    </Modal>
  );
}
