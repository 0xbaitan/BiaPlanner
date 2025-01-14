import SelectInput, { SelectInputProps } from "@/components/forms/SelectInput";

import Form from "react-bootstrap/Form";
import { IRecipe } from "@biaplanner/shared";
import { useGetRecipesQuery } from "@/apis/RecipeApi";

export type RecipeSelectProps = Omit<SelectInputProps<IRecipe>, "list" | "idSelector" | "nameSelector"> & {
  label?: string;
  error?: string;
};
export default function RecipeSelect(props: RecipeSelectProps) {
  const { label, error, ...rest } = props;
  const { data: recipes, isSuccess } = useGetRecipesQuery();

  return (
    <Form.Group>
      <Form.Label>{label ?? "Select a recipe"}</Form.Label>
      <SelectInput<IRecipe> {...rest} list={isSuccess ? recipes : []} idSelector={(recipe) => recipe.id} nameSelector={(recipe) => recipe.title} noDataLabel="No recipes available" />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}
