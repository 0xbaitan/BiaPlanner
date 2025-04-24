import { useEffect, useMemo, useState } from "react";

import FilterSelect from "@/components/forms/FilterSelect";
import Form from "react-bootstrap/Form";
import { IRecipeTag } from "@biaplanner/shared";
import InputLabel from "@/components/forms/InputLabel";
import { InputLabelProps } from "@/components/forms/InputLabel";
import { SelectInputProps } from "@/components/forms/SelectInput";
import { useGetRecipeTagsQuery } from "@/apis/RecipeTagsApi";

export type RecipeTagsSelectProps = Omit<SelectInputProps<IRecipeTag>, "list" | "idSelector" | "nameSelector" | "selectedValues" | "multi" | "create"> & {
  initialValue?: Pick<IRecipeTag, "id">[];
  inputLabelProps?: Omit<InputLabelProps, "children">;
  error?: string;
};
export default function RecipeTagsMultiselect(props: RecipeTagsSelectProps) {
  const { inputLabelProps, error, initialValue, onChange } = props;
  const { data: recipeTags, isError, isSuccess } = useGetRecipeTagsQuery();
  const noReceipeTags = isError || !recipeTags || recipeTags.length === 0;

  const initialValueAsPopulated = useMemo(() => {
    if (!isSuccess) return [];
    if (!recipeTags || recipeTags.length === 0) return [];
    return initialValue
      ?.map((tag) => {
        const populatedTag = recipeTags.find((t) => t.id === tag.id);
        return populatedTag;
      })
      .filter((tag) => tag !== undefined) as IRecipeTag[];
  }, [initialValue, recipeTags, isSuccess]);
  const [selectedValues, setSelectedValues] = useState<IRecipeTag[]>(initialValueAsPopulated);

  useEffect(() => {
    if (initialValueAsPopulated) {
      setSelectedValues(initialValueAsPopulated);
    }
  }, [initialValueAsPopulated]);

  if (isError) {
    return <div>Error loading recipe tags</div>;
  }
  if (noReceipeTags) {
    return <div>No recipe tags available</div>;
  }

  return (
    <Form.Group>
      <InputLabel {...inputLabelProps}>Recipe tags</InputLabel>
      <FilterSelect<IRecipeTag>
        {...props}
        selectLabel="Recipe tags"
        selectedValues={selectedValues}
        onChange={(selectedList, selectedOptions) => {
          setSelectedValues(selectedList);
          onChange?.(selectedList, selectedOptions);
        }}
        idSelector={(tag) => tag.id}
        list={!noReceipeTags ? recipeTags : []}
        nameSelector={(tag) => tag.name}
        multi
        create
        noDataLabel="No recipe tags available"
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}
