import { CookingMeasurement, IPantryItem, IPantryItemExtended, IRecipe } from "@biaplanner/shared";
import SelectInput, { SelectInputProps } from "@/components/forms/SelectInput";
import { useEffect, useState } from "react";

import CookingMeasurementInput from "@/features/admin/_products/components/CookingMeasurementInput";
import dayjs from "dayjs";

export type ConcreteIngredientPantryItemSelectProps = Omit<SelectInputProps<IPantryItem>, "idSelector" | "nameSelector" | "onChange"> & {
  onChange: ({ pantryItem, measurement }: { pantryItem: IPantryItem; measurement: CookingMeasurement }) => void | Promise<void>;
};

export default function ConcreteIngredientPantryItemSelect(props: ConcreteIngredientPantryItemSelectProps) {
  const { onChange, ...rest } = props;
  const [pantryItem, setPantryItem] = useState<IPantryItem>();
  const [measurement, setMeasurement] = useState<CookingMeasurement>();

  useEffect(() => {
    if (pantryItem && measurement) {
      onChange({ pantryItem, measurement });
    }
  }, [pantryItem, measurement, onChange]);

  return (
    <>
      <SelectInput<IPantryItem>
        {...rest}
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
        contentRenderer={({ state, props, methods, additionalMethods: { getValueCounterPart } }) => {
          if (state.values.length === 0) {
            return <div>No items available in your pantry</div>;
          }
          const actualItem = getValueCounterPart(state.values[0]);
          console.log("actualItem", actualItem);
          return (
            <div>
              {actualItem.product?.name} {actualItem.expiryDate ? `Expires in ${dayjs(actualItem.expiryDate).diff(dayjs(), "day")} days` : ""}
              {actualItem.availableMeasurements?.magnitude ? `(${actualItem.availableMeasurements.magnitude} ${actualItem.availableMeasurements.unit})` : ""}/
              {actualItem.totalMeasurements?.magnitude ? `(${actualItem.totalMeasurements.magnitude} ${actualItem.totalMeasurements.unit})` : ""}
            </div>
          );
        }}
        onChange={([selectedPantryItem]) => {
          setPantryItem(selectedPantryItem);
        }}
      />
      <CookingMeasurementInput
        onChange={(value) => {
          setMeasurement(value);
        }}
      />
    </>
  );
}
