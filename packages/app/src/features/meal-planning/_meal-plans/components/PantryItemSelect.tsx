import { IPantryItem, IRecipeIngredient } from "@biaplanner/shared";
import SelectInput, { SelectInputProps } from "@/components/forms/SelectInput";

import Form from "react-bootstrap/Form";
import { useGetIngredientCompatiblePantryItemsQuery } from "@/apis/PantryItemsApi";

export type PantryItemSelectProps = Omit<SelectInputProps<IPantryItem>, "list" | "idSelector" | "nameSelector"> & {
  ingredientId: string;
  label?: string;
  error?: string;
};
export default function PantryItemSelect(props: PantryItemSelectProps) {
  const { label, error, ingredientId, ...rest } = props;
  const { data: pantryItems, isSuccess } = useGetIngredientCompatiblePantryItemsQuery({
    ingredientId,
  });
  return (
    <Form.Group>
      <Form.Label>{label ?? "Select an item in your pantry"}</Form.Label>
      <SelectInput<IPantryItem>
        {...rest}
        list={isSuccess ? pantryItems : []}
        idSelector={(pantryItem) => pantryItem.id}
        nameSelector={(pantryItem) => pantryItem.product?.name ?? `pantry item (id: ${pantryItem.id})`}
        noDataLabel="No items available in your pantry"
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}
