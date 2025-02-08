import { IPantryItemExtended, IRecipe } from "@biaplanner/shared";
import SelectInput, { SelectInputProps } from "@/components/forms/SelectInput";

import dayjs from "dayjs";

export type ConcreteIngredientPantryItemSelectProps = Omit<SelectInputProps<IPantryItemExtended>, "idSelector" | "nameSelector">;

export default function ConcreteIngredientPantryItemSelect(props: ConcreteIngredientPantryItemSelectProps) {
  return (
    <SelectInput<IPantryItemExtended>
      {...props}
      idSelector={(pantryItem) => pantryItem.id}
      nameSelector={(pantryItem) => pantryItem.product?.name ?? `pantry item (id: ${pantryItem.id})`}
      itemRenderer={({ item, itemIndex, props, state, methods, additionalMethods: { getValueCounterPart } }) => {
        const actualItem = getValueCounterPart(item);
        return (
          <option
            key={itemIndex}
            onClick={() => {
              console.log(getValueCounterPart(item));
              methods.addItem(item);
            }}
          >
            {item.name} {itemIndex} {actualItem.expiryDate ? `Expires in ${dayjs(actualItem.expiryDate).diff(dayjs(), "day")} days` : ""}{" "}
            {actualItem.totalMeasurements?.magnitude ? `(${actualItem.totalMeasurements.magnitude} ${actualItem.totalMeasurements.unit})` : ""}
          </option>
        );
      }}
    />
  );
}
