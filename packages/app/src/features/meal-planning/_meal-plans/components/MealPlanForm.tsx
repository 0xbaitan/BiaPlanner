import { selectRecipe, useMealPlanFormState } from "../../reducers/MealPlanFormReducer";

import Form from "react-bootstrap/Form";
import RecipeSelect from "./RecipeSelect";
import { useStoreDispatch } from "@/store";

export default function MealPlanForm() {
  const { selectedRecipe } = useMealPlanFormState();
  const dispatch = useStoreDispatch();

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
      </Form>
    </div>
  );
}
