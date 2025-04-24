import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "react-bootstrap";
import { IWriteRecipeDto } from "@biaplanner/shared";
import IngredientItem from "./IngredientItem";
import IngredientModal from "./IngredientModal";
import { useRecipeFormActions } from "../../../meal-planning/reducers/RecipeFormReducer";

export default function IngredientList() {
  const formMethods = useFormContext<IWriteRecipeDto>();
  const { openCreateIngredientModal } = useRecipeFormActions();

  const { fields, append, update, remove } = useFieldArray({
    name: "ingredients",
    control: formMethods.control,
    keyName: "fieldId",
    rules: {
      required: true,
      validate: (value) => {
        if (value.length === 0) {
          return "At least one ingredient is required";
        }
        return true;
      },
    },
  });

  return (
    <div>
      <IngredientModal
        appendIngredient={(ingredient) => {
          append(ingredient);
        }}
        updateIngredient={(index, ingredient) => {
          update(index, ingredient);
        }}
      />
      <Button onClick={openCreateIngredientModal}>Add ingredient</Button>
      <ol>
        {fields.length === 0 && <div>No ingredients</div>}
        {fields.length > 0 &&
          fields.map((field, index: number) => (
            <IngredientItem
              key={field.fieldId}
              index={index}
              ingredient={field}
              onRemove={(index) => {
                remove(index);
              }}
            />
          ))}
      </ol>
    </div>
  );
}
