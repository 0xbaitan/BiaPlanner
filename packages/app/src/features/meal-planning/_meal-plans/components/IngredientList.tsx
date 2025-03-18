import IngredientListItem from "./IngredientListItem";
import { useIngredientManagementState } from "../../reducers/IngredientManagementReducer";

export default function IngredientList() {
  const { selectedRecipe } = useIngredientManagementState();
  const ingredients = selectedRecipe?.ingredients;

  return (
    <div>
      {ingredients && ingredients.length > 0 ? (
        <ul>
          {ingredients.map((ingredient, i) => (
            <IngredientListItem key={ingredient.id} ingredient={ingredient} index={i + 1} />
          ))}
        </ul>
      ) : (
        <div>No ingredients</div>
      )}
    </div>
  );
}
