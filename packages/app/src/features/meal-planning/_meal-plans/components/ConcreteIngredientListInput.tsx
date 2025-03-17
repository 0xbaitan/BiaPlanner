import { useCallback, useMemo, useState } from "react";

import ConcreteIngredientInput from "./ConcreteIngredientInput";
import { ConcreteRecipeFormValues } from "./MealPlanForm";
import { IRecipe } from "@biaplanner/shared";
import RecipeSelect from "./RecipeSelect";
import { useFormContext } from "react-hook-form";

export type ConcreteIngredientInputProps = {};

export default function ConcreteIngredientListInput(props: ConcreteIngredientInputProps) {
  const {} = props;
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

  const ingredientInputs = useMemo(() => {
    if (!recipe) {
      return [];
    }

    return recipe.ingredients.map((ingredient, index) => <ConcreteIngredientInput key={ingredient.id} recipeIngredient={ingredient} index={index} onChange={(value) => console.log(value)} />);
  }, [recipe]);

  return (
    <>
      <RecipeSelect onChange={([selectedRecipe]) => changeRecipe(selectedRecipe)} />
      {ingredientInputs}
    </>
  );
}
