import SelectInput, { SelectInputProps } from "@/components/forms/SelectInput";

import Form from "react-bootstrap/Form";
import { IRecipeTag } from "@biaplanner/shared";
import { useGetRecipeTagsQuery } from "@/apis/RecipeTagsApi";

export type RecipeTagsSelectProps = Omit<SelectInputProps<IRecipeTag>, "list" | "idSelector" | "nameSelector" | "selectedValues" | "multi" | "create"> & {
  initialValues?: IRecipeTag[];
  error?: string;
};
export default function RecipeTagsMultiselect(props: RecipeTagsSelectProps) {
  const { data: recipeTags, isError } = useGetRecipeTagsQuery();
  const noReceipeTags = isError || !recipeTags || recipeTags.length === 0;

  return (
    <Form.Group>
      <Form.Label>Recipe Tags</Form.Label>
      <SelectInput<IRecipeTag> {...props} idSelector={(tag) => tag.id} list={!noReceipeTags ? recipeTags : []} nameSelector={(tag) => tag.name} multi create noDataLabel="No recipe tags available" />
      <Form.Control.Feedback type="invalid">{props.error}</Form.Control.Feedback>
    </Form.Group>
  );
}
