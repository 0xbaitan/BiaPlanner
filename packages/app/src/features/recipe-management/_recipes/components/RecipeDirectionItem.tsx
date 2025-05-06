import { FaCheckCircle, FaTrash } from "react-icons/fa";
import { HTMLAttributes, useState } from "react";
import { IRecipeDirection, IWriteRecipeDto } from "@biaplanner/shared";

import { MdEdit } from "react-icons/md";
import { MemoizedTextInput } from "@/components/forms/TextInput";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useFormContext } from "react-hook-form";

export type RecipeDirecttionItemProps = HTMLAttributes<HTMLDivElement> & {
  item: IRecipeDirection;
  onRemove: (order: number) => void;
};
export default function RecipeDirectionItem(props: RecipeDirecttionItemProps) {
  const { item, onRemove, ...rest } = props;
  const formMethods = useFormContext<IWriteRecipeDto>();
  const [editable, setEditable] = useState(true);
  const { notify: notifyDeletion } = useDeletionToast<Partial<IRecipeDirection>>({
    identifierSelector: (entity) => `Direction (#${entity.order ?? 0 + 1})`,
    onConfirm: async (entity) => {
      onRemove(entity.order ?? 0);
    },
  });
  const [value, setValue] = useState(item.text);

  return (
    <div {...rest} className="bp-direction_item">
      <div className="bp-direction_item__text">
        <MemoizedTextInput
          value={value}
          onChange={(e) => {
            formMethods.setValue(`directions.${item.order - 1}.text`, e.target.value);
            setValue(e.target.value);
          }}
          hidden={!editable}
          label={`Direction #${item.order}`}
          placeholder="Enter direction"
          as="textarea"
        />

        {!editable && (
          <>
            <div className="bp-direction_item__text_readonly">{value}</div>
          </>
        )}
      </div>
      <div className="bp-direction_item__actions">
        {!editable ? (
          <button className="bp-ingredient_item__main__actions__btn" type="button" onClick={() => setEditable(true)}>
            <MdEdit size={20} />
          </button>
        ) : (
          <button className="bp-ingredient_item__main__actions__btn" type="button" onClick={() => setEditable(false)}>
            <FaCheckCircle size={20} />
          </button>
        )}
        <button className="bp-ingredient_item__main__actions__btn delete" type="button" onClick={() => notifyDeletion(item)}>
          <FaTrash size={20} />
        </button>
      </div>
    </div>
  );
}
