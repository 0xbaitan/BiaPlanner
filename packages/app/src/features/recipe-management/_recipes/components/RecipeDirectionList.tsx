import "../styles/RecipeDirectionList.scss";

import { IRecipeDirection, IWriteRecipeDto } from "@biaplanner/shared";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import Heading from "@/components/Heading";
import RecipeDirectionItem from "./RecipeDirectionItem";

export default function RecipeDirectionList({ directions }: { directions: IRecipeDirection[] }) {
  const formMethods = useFormContext<IWriteRecipeDto>();

  const { append, fields, remove } = useFieldArray({
    control: formMethods.control,
    name: "directions",
    keyName: "fieldId",
    rules: {
      required: true,
      validate: (value) => {
        if (value.length === 0) {
          return "At least one instruction is required";
        }
        return true;
      },
    },
  });

  return (
    <div className="bp-direction_list">
      <div className="bp-direction_list__header">
        <div className="bp-direction_list__header__title">
          <Heading level={Heading.Level.H2}>Directions</Heading>
          <small>Click the button to add directions.</small>
        </div>
        <Button
          variant="primary"
          className="bp-direction_list__add_btn"
          onClick={() => {
            append({ order: fields.length + 1, text: "" });
          }}
        >
          <FaPlus size={16} />
          &nbsp; Add direction
        </Button>
      </div>
      <div className="bp-direction_list__content">
        {fields.length > 0 ? (
          <ul className="bp-direction_list__items">
            {fields.map((direction, index) => (
              <li key={direction.fieldId} className="bp-direction_list__item">
                <RecipeDirectionItem
                  item={{
                    ...direction,
                    order: index + 1,
                  }}
                  onRemove={(order) => {
                    remove(order - 1);
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="bp-direction_list__empty">
            <p>No directions added yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
