import { Approximates, IConcreteIngredient, ICookingMeasurement, IRecipeIngredient, Volumes, Weights } from "@biaplanner/shared";
import { useEffect, useReducer } from "react";

import Form from "react-bootstrap/Form";
import { PayloadAction } from "@reduxjs/toolkit";
import ProductCategoryMultiselect from "@/components/forms/ProductCategoryMultiselect";
import TextInput from "@/components/forms/TextInput";

export type ConcreteIngredientInputProps = {
  recipeIngredient: IRecipeIngredient;
  initialValue?: Partial<IConcreteIngredient>;
  onChange: (value: Partial<IConcreteIngredient>) => void;
};

export default function ConcreteIngredientInput(props: ConcreteIngredientInputProps) {
  const { recipeIngredient} = props;

  return (

    <div>
      Ingredient: {recipeIngredient.title}
      Requirement: {recipeIngredient.quantity} {recipeIngredient.approximateUnit}
    </div>


  )

}



