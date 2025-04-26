import "../styles/RecipeItemCard.scss";
import "../styles/RecipeHorizontalCard.scss";

import Button from "react-bootstrap/esm/Button";
import { FaTrashCan } from "react-icons/fa6";
import { IRecipe } from "@biaplanner/shared";
import Pill from "@/components/Pill";
import { getImagePath } from "@/util/imageFunctions";

export type RecipeHorizontalCardProps = {
  recipe: IRecipe;
  isSelected?: boolean; // Whether the recipe is already selected
  onSelect?: (recipe: IRecipe) => void; // Callback for selecting a recipe
  onRemove?: (recipeId: string) => void; // Callback for removing a recipe
};

export default function RecipeHorizontalCard(props: RecipeHorizontalCardProps) {
  const { recipe, isSelected, onSelect, onRemove } = props;

  return (
    <div className="bp-recipe_item_card">
      <div className="bp-recipe_item_card__main">
        {/* Recipe Info */}
        <div className="bp-recipe_item_card__recipe_info">
          <img className="bp-recipe_item_card__img" src={getImagePath(recipe.coverImage)} alt={recipe.title} />
          <div className="bp-recipe_item_card__recipe_info__details">
            <div className="bp-recipe_item_card__recipe_name">
              {recipe.title} {isSelected && <span className="bp-recipe_item_card__badge active">Selected</span>}
            </div>
            <div className="bp-recipe_item_card__description">{recipe.description}</div>
            <div className="bp-recipe_item_card__categories">
              {recipe.tags?.map((category) => (
                <Pill key={category.id} className="bp-recipe_item_card__category">
                  {category.name}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bp-recipe_item_card__actions">
          {!isSelected && (
            <Button variant="outline-primary" onClick={() => onSelect?.(recipe)}>
              Select Recipe
            </Button>
          )}

          {isSelected && (
            <Button variant="outline-danger" className="bp-recipe_item_card__remove_button" onClick={() => onRemove?.(recipe.id)}>
              <FaTrashCan />
              &nbsp;Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
