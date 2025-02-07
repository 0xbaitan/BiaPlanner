import { IRecipe } from "@biaplanner/shared";
import RecipeSelect from "./RecipeSelect";
import { useState } from "react";

export type ConcreteIngredientInputProps = {};

export default function ConcreteIngredientListInput(props: ConcreteIngredientInputProps) {
  const [recipe, setRecipe] = useState<IRecipe>();
  console.log(recipe);

  return <RecipeSelect onChange={([selectedRecipe]) => setRecipe(selectedRecipe)} />;
}
