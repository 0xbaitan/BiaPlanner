import { IRecipeDirection, IWriteRecipeDto } from "@biaplanner/shared";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "react-bootstrap";
import Heading from "@/components/Heading";
import RecipeDirectionItem from "./RecipeDirectionItem";

export default function RecipeDirectionList({ directions }: { directions: IRecipeDirection[] }) {
  const formMethods = useFormContext<IWriteRecipeDto>();

  const { append, fields, insert, remove } = useFieldArray({
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
    <div>
      <Heading level={Heading.Level.H2}>Directions</Heading>
      <p>Click on the instructions to edit them.</p>
      <Button
        variant="primary"
        onClick={() => {
          append({ order: fields.length + 1, text: "" });
        }}
      >
        Add direction
      </Button>
      <div>
        {directions?.map((direction, index) => (
          <RecipeDirectionItem
            onRemove={(order) => {
              remove(order - 1);
            }}
            key={index}
            item={direction}
          />
        ))}
      </div>
    </div>
  );
}
