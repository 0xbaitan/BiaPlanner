import ConcreteIngredientInput from "./ConcreteIngredientInput";
import { IRecipe } from "@biaplanner/shared";
import RecipeSelect from "./RecipeSelect";
import { useState } from "react";

export type ConcreteIngredientInputProps = {};

export default function ConcreteIngredientListInput(props: ConcreteIngredientInputProps) {
  const [recipe, setRecipe] = useState<IRecipe>();
  console.log(recipe);

  return (
    <>
      <RecipeSelect onChange={([selectedRecipe]) => setRecipe(selectedRecipe)} />
      {recipe && recipe.ingredients.map((ingredient, index) => <ConcreteIngredientInput index={index} key={ingredient.id} recipeIngredient={ingredient} onChange={(value) => console.log(value)} />)}
    </>
  );
}
