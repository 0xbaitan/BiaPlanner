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

  if (isError || !recipeTags || recipeTags.length === 0) return <div>Failed to fetch recipe tags</div>;

  return (
    <Form.Group>
      <Form.Label>Recipe Tags</Form.Label>
      <SelectInput<IRecipeTag> {...props} idSelector={(tag) => tag.id} list={recipeTags} nameSelector={(tag) => tag.name} multi create />
      <Form.Control.Feedback type="invalid">{props.error}</Form.Control.Feedback>
    </Form.Group>
  );
}
