import "../styles/IngredientItem.scss";

import { DeepPartial } from "utility-types";
import { FaTrash } from "react-icons/fa";
import { IWriteRecipeIngredientDto } from "@biaplanner/shared";
import { MdEdit } from "react-icons/md";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";
import { useRecipeFormActions } from "../../../meal-planning/reducers/RecipeFormReducer";

type IngredientItemProps = {
  ingredient: IWriteRecipeIngredientDto;
  index: number;
  onRemove: (index: number) => void;
};

export default function IngredientItem(props: IngredientItemProps) {
  const { ingredient, index, onRemove } = props;
  const { openUpdateIngredientModal } = useRecipeFormActions();
  const { data: productCategories, isSuccess } = useGetProductCategoriesQuery();

  const getIngredientCategoryName = (categoryId: string) => {
    const category = productCategories?.find((category) => category.id === categoryId);
    return category ? category.name : undefined;
  };

  const { notify: notifyDeletion } = useDeletionToast<{ ingredient: DeepPartial<IWriteRecipeIngredientDto>; index: number }>({
    identifierSelector: (entity) => `${entity.ingredient.title} Ingredient (#${entity.index + 1})`,
    onConfirm: async (entity) => {
      onRemove(entity.index);
    },
  });

  return (
    <div className="bp-ingredient_item">
      <div className="bp-ingredient_item__main">
        <div className="bp-ingredient_item__main__count">
          <div className="bp-ingredient_item__main__count__index">{index + 1}</div>
        </div>

        <div className="bp-ingredient__overall">
          <div className="bp-ingredient_item__main__details">
            <div className="bp-ingredient_item__main__title fw-bold">{ingredient.title}</div>
            <div className="bp-ingredient_item__main__measurement">
              <span className="bp-ingredient_item__main__measurement__magnitude fw-bold">{ingredient.measurement?.magnitude}</span>
              <span className="bp-ingredient_item__main__measurement__unit fw-bold">{ingredient.measurement?.unit}</span>
            </div>
          </div>
          <div className="bp-ingredient_item__categories">
            {ingredient.productCategories.map((category, index) => (
              <div key={index} className="bp-ingredient_item__categories__category">
                {isSuccess && getIngredientCategoryName(category.id)?.slice(0, 10)}
              </div>
            ))}
          </div>
        </div>
        <div className="bp-ingredient_item__main__actions">
          <button className="bp-ingredient_item__main__actions__btn" type="button" onClick={() => openUpdateIngredientModal(index, ingredient)}>
            <MdEdit size={20} />
          </button>
          <button className="bp-ingredient_item__main__actions__btn delete" type="button" onClick={() => notifyDeletion({ ingredient, index })}>
            <FaTrash size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
