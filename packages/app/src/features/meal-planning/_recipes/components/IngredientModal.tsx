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

type IngredientItemProps = {
  ingredient: IWriteRecipeIngredientDto;
  index: number;
};

export function IngredientItem(props: IngredientItemProps) {
  const { ingredient, index } = props;
  const { openUpdateIngredientModal, removeIngredient } = useRecipeFormActions();
  const { data: productCategories, isSuccess } = useGetProductCategoriesQuery();

  const getIngredientCategoryName = (categoryId: string) => {
    const category = productCategories?.find((category) => category.id === categoryId);
    return category ? category.name : undefined;
  };

  const { notify: notifyDeletion } = useDeletionToast<{ ingredient: DeepPartial<IRecipeIngredient>; index: number }>({
    identifierSelector: (entity) => `${entity.ingredient.title} Ingredient (#${entity.index + 1})`,
    onConfirm: async (entity) => {
      removeIngredient(entity.index);
    },
  });
  return (
    <div className="bp-ingredient_item">
      <div className="bp-ingredient_item__main">
        <div className="bp-ingredient_item__main__count">
          <div className="bp-ingredient_item__main__count__index">{index + 1}</div>
        </div>
        <div className="bp-ingredient_item__main__details">
          <div className="d-flex">
            <div className="bp-ingredient_item__main__title">{ingredient.title}</div>
            <div className="bp-ingredient_item__main__measurement">
              <span className="bp-ingredient_item__main__measurement__magnitude">{ingredient.measurement?.magnitude}</span>
              <span className="bp-ingredient_item__main__measurement__unit">{ingredient.measurement?.unit}</span>
            </div>
          </div>
          <div className="d-flex">
            <div className="bp-ingredient_item__categories">
              {ingredient.productCategories.map((category, index) => (
                <div key={index} className="bp-ingredient_item__categories__category">
                  {isSuccess && <span className="bp-ingredient_item__categories__category__name">{getIngredientCategoryName(category.id)}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bp-ingredient_item__main__actions">
          <button className="bp-ingredient_item__main__actions__btn" type="button" onClick={() => openUpdateIngredientModal(index)}>
            <MdEdit size={20} />
          </button>
          <button className="bp-ingredient_item__main__actions__btn" type="button" onClick={() => notifyDeletion({ ingredient, index })}>
            <FaTrash size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
