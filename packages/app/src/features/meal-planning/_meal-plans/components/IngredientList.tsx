import IngredientListItem from "./IngredientListItem";
import IngredientManagementOffcanvas from "./IngredientManagementOffcanvas";
import { useIngredientManagementState } from "../../reducers/IngredientManagementReducer";
import { useMemo } from "react";

export default function IngredientList() {
  const { selectedRecipe } = useIngredientManagementState();
  console.log("Selected recipe:", selectedRecipe?.ingredients);
  const ingredientListItems = useMemo(() => selectedRecipe?.ingredients.map((ingredient) => <IngredientListItem key={ingredient.id} ingredient={ingredient} index={selectedRecipe.ingredients.indexOf(ingredient) + 1} />) || [], [selectedRecipe]);

  return (
    <div>
      <IngredientManagementOffcanvas />
      <ul className="bp-ingredient_list">{ingredientListItems.length > 0 ? ingredientListItems : <div className="bp-ingredient_list__no_ingredients">No ingredients selected</div>}</ul>
    </div>
  );
}
