import { Approximates, CookingMeasurementType, CookingMeasurementUnit, ICookingMeasurement, Volumes, Weights, getCookingMeasurement, getCookingMeasurementList } from "@biaplanner/shared";
import SelectInput, { SelectInputProps } from "@/components/forms/SelectInput";

import { useMemo } from "react";

export type ScopedMeasurementSelectProps = Omit<SelectInputProps<ICookingMeasurement>, "list" | "idSelector" | "nameSelector" | "selectedValues" | "onChange"> & {
  onChange: (value: CookingMeasurementUnit) => void;
  type: CookingMeasurementType;
  initialValue: ScopedMeasurementSelectProps["type"] extends CookingMeasurementType.WEIGHT
    ? Weights
    : ScopedMeasurementSelectProps["type"] extends CookingMeasurementType.VOLUME
      ? Volumes
      : ScopedMeasurementSelectProps["type"] extends CookingMeasurementType.APPROXIMATE
        ? Approximates
        : CookingMeasurementUnit;
};

export default function ScopedMeasurementSelect(props: ScopedMeasurementSelectProps) {
  const { type, onChange, initialValue, ...rest } = props;

  const options = useMemo(() => {
    const allMeasurements = getCookingMeasurementList();
    return allMeasurements.filter((measurement) => measurement.type === type);
  }, [type]);

  const initialSelectedValue = useMemo(() => {
    if (!initialValue) return undefined;
    return getCookingMeasurement(initialValue);
  }, [initialValue]);

  return (
    <SelectInput<ICookingMeasurement>
      {...rest}
      onChange={([measurement]) => {
        onChange(measurement?.unit);
      }}
      selectedValues={initialSelectedValue ? [initialSelectedValue] : undefined}
      idSelector={(measurement) => measurement.id}
      list={options}
      nameSelector={(measurement) => measurement?.unit}
    />
  );
}
