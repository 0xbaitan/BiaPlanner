import "../styles/IngredientList.scss";

import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import Heading from "@/components/Heading";
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
    <div className="bp-ingredient_list">
      <IngredientModal
        appendIngredient={(ingredient) => {
          append(ingredient);
        }}
        updateIngredient={(index, ingredient) => {
          update(index, ingredient);
        }}
      />
      <div className="bp-ingredient_list__header">
        <div className="bp-ingredient_list__header__title">
          <Heading level={Heading.Level.H2}>Ingredients</Heading>
          <small className="text-muted">Click button to open a modal to add ingredients.</small>
        </div>
        <Button onClick={openCreateIngredientModal} className="bp-direction_list__add_btn">
          <FaPlus size={16} />
          &nbsp;Add ingredient
        </Button>
      </div>

      <div className="bp-ingredient_list__content">
        {fields.length === 0 ? (
          <div className="bp-ingredient_list__empty">
            <p>No ingredients added yet</p>
          </div>
        ) : (
          <ol className="bp-ingredient_list__items">
            {fields.map((field, index: number) => (
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
        )}
      </div>
    </div>
  );
}
