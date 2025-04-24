import { IRecipeDirection, IWriteRecipeDto } from "@biaplanner/shared";

import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { HTMLAttributes } from "react";
import { MemoizedTextInput } from "@/components/forms/TextInput";
import { useFormContext } from "react-hook-form";

export type RecipeDirecttionItemProps = HTMLAttributes<HTMLDivElement> & {
  item: IRecipeDirection;
  onRemove: (order: number) => void;
};
export default function RecipeDirectionItem(props: RecipeDirecttionItemProps) {
  const { item, onRemove, ...rest } = props;
  const formMethods = useFormContext<IWriteRecipeDto>();

  return (
    <div {...rest}>
      <input hidden {...formMethods.register(`directions.${item.order - 1}.order`, { value: item.order })} />
      <MemoizedTextInput
        {...formMethods.register(`directions.${item.order - 1}.text`, {
          required: true,
          value: item.text,
        })}
        label={`Direction #${item.order}`}
        placeholder="Enter direction"
        isInvalid={!!formMethods.formState.errors.directions?.[item.order - 1]?.text}
        error={formMethods.formState.errors.directions?.[item.order - 1]?.text?.message}
        as="textarea"
      />
      <Button
        variant="danger"
        onClick={() => {
          onRemove(item.order);
        }}
      >
        Remove
      </Button>
    </div>
  );
}
