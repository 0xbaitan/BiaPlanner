import "../styles/MagnitudeAndUnitInput.scss";

import { useCallback, useEffect, useMemo, useState } from "react";

import { EnumLike } from "zod";
import Form from "react-bootstrap/esm/Form";
import { FormControlProps } from "react-bootstrap/esm/FormControl";
import { FormSelectProps } from "react-bootstrap/esm/FormSelect";

export type CustomisedMagnitudeAndUnitProps<T extends EnumLike> = Partial<
  Omit<MagnitudeAndUnitProps<T>, "options"> & {
    filter: {
      units: T[keyof T][];
      type: "include" | "exclude";
    };
  }
>;
export type MagnitudeAndUnitProps<T extends EnumLike> = {
  defaultMagnitude?: number;
  options: { label: string; value: T[keyof T] }[];
  defaultUnit?: T[keyof T];
  constraints?: {
    unit: T[keyof T];
    minMagnitude?: number;
    maxMagnitude?: number;
  }[];
  magnitudeControlProps?: Omit<FormControlProps, "type" | "value" | "onChange">;
  unitControlProps?: Omit<FormSelectProps, "value" | "onChange">;
  onChange?: (magnitude: number, unit: T[keyof T]) => void;
  strictOnConstraints?: boolean;
};

export default function MagnitudeAndUnitInput<T extends EnumLike>(props: MagnitudeAndUnitProps<T>) {
  const { defaultMagnitude, defaultUnit, options, onChange, magnitudeControlProps, unitControlProps, constraints, strictOnConstraints } = props;
  const [defaultMax, defaultMin] = useMemo(() => {
    let defaultMin: number | undefined = Number(magnitudeControlProps?.min);
    let defaultMax: number | undefined = Number(magnitudeControlProps?.max);
    defaultMin = isNaN(defaultMin) ? undefined : defaultMin;
    defaultMax = isNaN(defaultMax) ? undefined : defaultMax;
    // return [defaultMax, defaultMin];
    return [defaultMax, defaultMin];
  }, [magnitudeControlProps]);

  const [magnitude, setMagnitude] = useState(defaultMagnitude ?? 0);
  const [unit, setUnit] = useState(defaultUnit ?? options[0].value);
  const [min, setMin] = useState<number | undefined>(defaultMin);
  const [max, setMax] = useState<number | undefined>(defaultMax);
  const unitOptions = useMemo(() => {
    return options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ));
  }, [options]);

  const onMagnitudeChange = useCallback(
    (newValue: any) => {
      const value = Number(newValue);
      if (!strictOnConstraints) {
        setMagnitude(value);
      } else if (min && value < min) {
        setMagnitude(min);
      } else if (max && value > max) {
        setMagnitude(max);
      } else if (defaultMax && value > defaultMax) {
        setMagnitude(defaultMax);
      } else if (defaultMin && value < defaultMin) {
        setMagnitude(defaultMin);
      } else {
        setMagnitude(value);
      }
    },
    [defaultMax, defaultMin, max, min, strictOnConstraints]
  );

  useEffect(() => {
    onChange?.(magnitude, unit);
  }, [magnitude, unit, onChange]);

  useEffect(() => {
    if (!constraints || constraints.length === 0) return;
    const constraint = constraints.find((c) => c.unit === unit);
    if (constraint) {
      setMin(constraint.minMagnitude ?? defaultMin);
      setMax(constraint.maxMagnitude ?? defaultMax);
    } else {
      setMin(defaultMin);
      setMax(defaultMax);
    }
  }, [unit, constraints, defaultMin, defaultMax]);

  useEffect(() => {
    onMagnitudeChange(magnitude);
  }, [magnitude, onMagnitudeChange, unit]);

  return (
    <Form.Group className="bp-magnitude_unit_input">
      <Form.Control {...magnitudeControlProps} className="bp-magnitude_unit_input__field--magnitude" min={min} max={max} type="number" value={magnitude} onChange={(e) => onMagnitudeChange(e.target.value)} />
      <select value={unit} onChange={(e) => setUnit(e.target.value as T[keyof T])} className="bp-magnitude_unit_input__field--unit">
        {unitOptions}
      </select>
    </Form.Group>
  );
}
