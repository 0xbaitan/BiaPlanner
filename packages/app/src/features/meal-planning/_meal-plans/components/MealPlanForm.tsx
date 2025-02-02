import { selectRecipe, useMealPlanFormState } from "../../reducers/MealPlanFormReducer";

import Form from "react-bootstrap/Form";
import { IRecipeIngredient } from "@biaplanner/shared";
import PantryItemSelect from "./PantryItemSelect";
import RecipeIngredientSelect from "./RecipeIngredientSelect";
import RecipeSelect from "./RecipeSelect";
import { useState } from "react";
import { useStoreDispatch } from "@/store";

export default function MealPlanForm() {
  const { selectedRecipe } = useMealPlanFormState();
  const dispatch = useStoreDispatch();
  const [ingredient, setIngredient] = useState<IRecipeIngredient | undefined>(undefined);

  console.log(selectedRecipe);
  return (
    <div>
      <h2>Meal Plan Page Form</h2>
      <Form>
        <RecipeSelect
          label="Select a recipe"
          onChange={([recipe]) => {
            dispatch(selectRecipe(recipe));
          }}
        />
        <RecipeIngredientSelect
          recipeId={String(selectedRecipe?.id)}
          onChange={([ingredient]) => {
            setIngredient(ingredient);
          }}
        />
        <PantryItemSelect ingredientId={String(ingredient?.id)} />
      </Form>
    </div>
  );
}
