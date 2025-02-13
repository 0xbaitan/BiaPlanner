import { CookingMeasurement, CookingMeasurementUnit, IPantryItem, getCookingMeasurement } from "@biaplanner/shared";
import SelectInput, { Option, SelectInputProps } from "@/components/forms/SelectInput";
import { useEffect, useMemo, useState } from "react";

import CookingMeasurementInput from "@/features/admin/_products/components/CookingMeasurementInput";
import convertCookingMeasurement from "@biaplanner/shared/build/util/CookingMeasurementConversion";
import dayjs from "dayjs";

export type ConcreteIngredientPantryItemSelectProps = Omit<SelectInputProps<IPantryItem>, "idSelector" | "nameSelector" | "onChange"> & {
  onChange: ({ pantryItem, measurement }: { pantryItem: IPantryItem; measurement: CookingMeasurement }) => void | Promise<void>;
  ingredientMeasurementUnit: CookingMeasurementUnit;
  initialValue?: IPantryItem;
};

export default function ConcreteIngredientPantryItemSelect(props: ConcreteIngredientPantryItemSelectProps) {
  const { onChange, ingredientMeasurementUnit, initialValue, ...rest } = props;
  const [pantryItem, setPantryItem] = useState<IPantryItem | undefined>(initialValue);
  const [measurement, setMeasurement] = useState<CookingMeasurement>();

  useEffect(() => {
    if (pantryItem && measurement) {
      onChange({ pantryItem, measurement });
    }
  }, [pantryItem, measurement, onChange]);

  const maxMagnitude = useMemo(() => {
    if (!pantryItem?.availableMeasurements || !measurement?.unit) {
      return undefined;
    }

    const maxMagnitudeInBase = pantryItem.availableMeasurements.magnitude;
    const unitInBase = pantryItem.availableMeasurements.unit;
    const maxMagnitudeInExpectedUnit = convertCookingMeasurement(
      {
        magnitude: maxMagnitudeInBase,
        unit: unitInBase,
      },
      measurement?.unit
    );

    return maxMagnitudeInExpectedUnit.magnitude;
  }, [measurement?.unit, pantryItem?.availableMeasurements]);

  console.log("maxMagnitude", maxMagnitude + " " + measurement?.unit);

  return (
    <>
      <SelectInput<IPantryItem>
        {...rest}
        selectedValues={pantryItem ? [pantryItem] : []}
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
          let firstOption: Option | undefined;
          if (!state.values || state.values.length === 0 || !(firstOption = state.values.at(0))) {
            return <div>No items available in your pantry</div>;
          }
          const actualItem = getValueCounterPart(firstOption);

          if (!actualItem) {
            return <div>No items available in your pantry</div>;
          }

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
        minMagnitude={0}
        maxMagnitude={maxMagnitude}
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
