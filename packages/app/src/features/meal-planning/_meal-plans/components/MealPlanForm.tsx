import { selectRecipe, useMealPlanFormState } from "../../reducers/MealPlanFormReducer";

import ConcreteIngredientListInput from "./ConcreteIngredientListInput";
import Form from "react-bootstrap/Form";
import { IRecipeIngredient } from "@biaplanner/shared";
import PantryItemSelect from "./PantryItemSelect";
import RecipeIngredientSelect from "./RecipeIngredientSelect";
import RecipeSelect from "./RecipeSelect";
import { useState } from "react";
import { useStoreDispatch } from "@/store";

export default function MealPlanForm() {
  return (
    <div>
      <h2>Meal Plan Page Form</h2>
      <Form>
        <ConcreteIngredientListInput />
      </Form>
    </div>
  );
}
