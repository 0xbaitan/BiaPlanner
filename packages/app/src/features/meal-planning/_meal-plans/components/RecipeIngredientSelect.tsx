import SelectInput, { SelectInputProps } from "@/components/forms/SelectInput";

import Form from "react-bootstrap/Form";
import { IRecipeIngredient } from "@biaplanner/shared";
import { useGetRecipeIngredientsQuery } from "@/apis/RecipeIngredientsApi";

export type RecipeIngredientSelectProps = Omit<SelectInputProps<IRecipeIngredient>, "list" | "idSelector" | "nameSelector"> & {
  recipeId: string;
  label?: string;
  error?: string;
};
export default function RecipeIngredientSelect(props: RecipeIngredientSelectProps) {
  const { label, error, recipeId, ...rest } = props;
  const { data: ingredients, isSuccess } = useGetRecipeIngredientsQuery({
    recipeId,
  });

  return (
    <Form.Group>
      <Form.Label>{label ?? "Select a recipe ingredient"}</Form.Label>
      <SelectInput<IRecipeIngredient>
        {...rest}
        list={isSuccess ? ingredients : []}
        idSelector={(ingredient) => ingredient.id}
        nameSelector={(ingredient) => ingredient.title ?? `Ingredient (id: ${ingredient.id})`}
        noDataLabel="No ingredients available"
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}
