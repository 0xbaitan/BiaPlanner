import SelectInput, { SelectInputProps } from "@/components/forms/SelectInput";

import FilterSelect from "@/components/forms/FilterSelect";
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

      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}
