import "../styles/IngredientItem.scss";

import { useConfirmedIngredientsState, useOpenUpdateIngredientModal } from "../../reducers/RecipeFormReducer";

import { DeepPartial } from "utility-types";
import { IRecipeIngredient } from "@biaplanner/shared";
import { useDeletionToast } from "@/components/toasts/DeletionToast";

export type IngredientItemProps = {
  ingredient: IRecipeIngredient;
  index: number;
};
export default function IngredientItem(props: IngredientItemProps) {
  const { ingredient, index } = props;
  const openUpdateIngredientModal = useOpenUpdateIngredientModal();
  const { removeIngredient } = useConfirmedIngredientsState();

  const { notify: notifyDeletion } = useDeletionToast<{ ingredient: DeepPartial<IRecipeIngredient>; index: number }>({
    identifierSelector: (entity) => `${entity.ingredient.title} Ingredient (#${entity.index + 1})`,
    onConfirm: async (entity) => {
      removeIngredient(entity.index);
    },
  });
  return (
    <div className="bp-ingredient_item">
      <div className="bp-ingredient_item__main">
        <div className="bp-ingredient_item__main__count">{index + 1}</div>
        <div className="bp-ingredient_item__main__title">{ingredient.title}</div>
        <div className="bp-ingredient_item__main__measurement">
          <span className="bp-ingredient_item__main__measurement__magnitude">{ingredient.measurement?.magnitude}</span>
          <span className="bp-ingredient_item__main__measurement__unit">{ingredient.measurement?.unit}</span>
        </div>
        <div className="bp-ingredient_item__main__actions">
          <button className="bp-ingredient_item__main__actions__edit" onClick={() => openUpdateIngredientModal(index, ingredient)}>
            Edit
          </button>
          <button className="bp-ingredient_item__main__actions__delete" onClick={() => notifyDeletion({ ingredient, index })}>
            Delete
          </button>
        </div>
      </div>
      <div className="bp-ingredient_item__categories">
        {ingredient.productCategories.map((category, index) => (
          <div key={index} className="bp-ingredient_item__categories__category">
            {category.name}
          </div>
        ))}
      </div>
    </div>
  );
}
