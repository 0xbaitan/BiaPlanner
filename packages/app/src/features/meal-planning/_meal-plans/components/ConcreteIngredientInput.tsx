import { Approximates, IConcreteIngredient, ICookingMeasurement, IRecipeIngredient, Volumes, Weights } from "@biaplanner/shared";
import { useEffect, useReducer } from "react";

import ConcreteIngredientPantryItemSelect from "./ConcreteIngredientPantryItemSelect";
import Form from "react-bootstrap/Form";
import { PayloadAction } from "@reduxjs/toolkit";
import ProductCategoryMultiselect from "@/components/forms/ProductCategoryMultiselect";
import TextInput from "@/components/forms/TextInput";
import { useGetIngredientCompatiblePantryItemsQuery } from "@/apis/PantryItemsApi";

export type ConcreteIngredientInputProps = {
  recipeIngredient: IRecipeIngredient;
  initialValue?: Partial<IConcreteIngredient>;
  onChange: (value: Partial<IConcreteIngredient>) => void;
};

export default function ConcreteIngredientInput(props: ConcreteIngredientInputProps) {
  const { recipeIngredient } = props;
  const {
    data: applicablePantryItems,
    isLoading,
    isError,
  } = useGetIngredientCompatiblePantryItemsQuery({
    ingredientId: recipeIngredient.id,
  });

  console.log(applicablePantryItems);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      Ingredient: {recipeIngredient.title}
      Requirement: {recipeIngredient.measurement?.magnitude} {recipeIngredient.measurement?.unit}
      <ConcreteIngredientPantryItemSelect list={applicablePantryItems ?? []} onChange={(value) => console.log(value)} />
    </div>
  );
}
