import "../styles/IngredientList.scss";

import IngredientListItem from "./IngredientListItem";
import IngredientManagementOffcanvas from "./IngredientManagementOffcanvas";
import { useMealPlanFormState } from "../../reducers/MealPlanFormReducer";
import { useMemo } from "react";

export default function IngredientList() {
  const { selectedRecipe } = useMealPlanFormState();
  console.log("Selected recipe:", selectedRecipe?.ingredients);
  const ingredientListItems = useMemo(() => selectedRecipe?.ingredients.map((ingredient) => <IngredientListItem key={ingredient.id} ingredient={ingredient} index={selectedRecipe.ingredients.indexOf(ingredient) + 1} />) || [], [selectedRecipe]);

  return (
    <div className="mt-4">
      <IngredientManagementOffcanvas />
      <ul className="bp-ingredient_list">{ingredientListItems.length > 0 ? ingredientListItems : <div className="bp-ingredient_list__no_ingredients">No ingredients selected</div>}</ul>
    </div>
  );
}
