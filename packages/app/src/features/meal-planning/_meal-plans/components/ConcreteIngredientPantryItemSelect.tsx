import { CookingMeasurement, CookingMeasurementUnit, IPantryItem, getCookingMeasurement } from "@biaplanner/shared";
import SelectInput, { SelectInputProps } from "@/components/forms/SelectInput";
import { useEffect, useState } from "react";

import CookingMeasurementInput from "@/features/admin/_products/components/CookingMeasurementInput";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";

export type ConcreteIngredientPantryItemSelectProps = Omit<SelectInputProps<IPantryItem>, "idSelector" | "nameSelector" | "onChange"> & {
  onChange: ({ pantryItem, measurement }: { pantryItem: IPantryItem; measurement: CookingMeasurement }) => void | Promise<void>;
  ingredientMeasurementUnit: CookingMeasurementUnit;
};

export default function ConcreteIngredientPantryItemSelect(props: ConcreteIngredientPantryItemSelectProps) {
  const { onChange, ingredientMeasurementUnit, ...rest } = props;
  const [pantryItem, setPantryItem] = useState<IPantryItem>();
  const [measurement, setMeasurement] = useState<CookingMeasurement>();
  const formMethods = useFormContext();
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
        disabled={!pantryItem}
        initialValue={{
          magnitude: 0,
          unit: ingredientMeasurementUnit,
        }}
        scoped={pantryItem?.product?.measurementType ?? getCookingMeasurement(ingredientMeasurementUnit).type ?? false}
        onChange={(value) => {
          setMeasurement(value);
        }}
      />
    </>
  );
}
