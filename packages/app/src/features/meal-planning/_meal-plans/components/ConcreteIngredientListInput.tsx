import { useCallback, useState } from "react";

import ConcreteIngredientInput from "./ConcreteIngredientInput";
import { ConcreteRecipeFormValues } from "./MealPlanForm";
import { IRecipe } from "@biaplanner/shared";
import RecipeSelect from "./RecipeSelect";
import { useFormContext } from "react-hook-form";

export type ConcreteIngredientInputProps = {};

export default function ConcreteIngredientListInput(props: ConcreteIngredientInputProps) {
  const [recipe, setRecipe] = useState<IRecipe>();
  console.log(recipe);
  const formMethods = useFormContext<ConcreteRecipeFormValues>();

  const changeRecipe = useCallback(
    (recipe: IRecipe) => {
      setRecipe(recipe);
      formMethods.setValue("recipeId", recipe.id);
      formMethods.setValue(
        "confirmedIngredients",
        recipe.ingredients.map((ingredient) => ({ ingredientId: ingredient.id }))
      );
    },
    [formMethods, setRecipe]
  );

  return (
    <>
      <RecipeSelect onChange={([selectedRecipe]) => changeRecipe(selectedRecipe)} />
      {recipe && recipe.ingredients.map((ingredient, index) => <ConcreteIngredientInput index={index} key={ingredient.id} recipeIngredient={ingredient} onChange={(value) => console.log(value)} />)}
    </>
  );
}
