import { Approximates, CookingMeasurement, CookingMeasurementType, Weights, getCookingMeasurement } from "@biaplanner/shared";
import MeasurementInput, { MeasurementInputProps } from "@/features/meal-planning/_recipes/components/MeasurementInput";
import React, { useCallback, useEffect, useReducer } from "react";
import ScopedMeasurementSelect, { ScopedMeasurementSelectProps } from "@/features/meal-planning/_meal-plans/components/ScopedMeasurementSelect";

import Form from "react-bootstrap/Form";

export type CookingMeasurementInputProps = {
  initialValue?: CookingMeasurement;
  onChange: (value: CookingMeasurement) => void;
  scoped?: CookingMeasurementType | false;
  disabled?: boolean;
  minMagnitude?: number;
  maxMagnitude?: number;
};

type CookingMeasurementInputState = CookingMeasurement;
enum CookingMeasurementInputActionType {
  UPDATE_COOKING_MEASUREMENT = "UPDATE_COOKING_MEASUREMENT",
}
type CookingMeasurementInputAction = {
  type: CookingMeasurementInputActionType;
  payload: Partial<CookingMeasurement>;
};

const initialState: CookingMeasurementInputState = {
  magnitude: 0,
  unit: Weights.GRAM,
};

function CookingMeasurementReducer(state: CookingMeasurementInputState, action: CookingMeasurementInputAction): CookingMeasurementInputState {
  switch (action.type) {
    case CookingMeasurementInputActionType.UPDATE_COOKING_MEASUREMENT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
export default function CookingMeasurementInput(props: CookingMeasurementInputProps) {
  const { initialValue, onChange, scoped, disabled, minMagnitude, maxMagnitude } = props;
  const [measurement, setMeasurement] = useReducer((state: CookingMeasurementInputState, action: CookingMeasurementInputAction) => CookingMeasurementReducer(state, action), initialValue ?? initialState);

  useEffect(() => {
    onChange(measurement);
  }, [measurement, onChange]);

  const onMagnitudeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const magnitude = parseFloat(e.target.value);
    if (isNaN(magnitude)) {
      setMeasurement({ type: CookingMeasurementInputActionType.UPDATE_COOKING_MEASUREMENT, payload: { magnitude: 0 } });
    } else if (minMagnitude && magnitude < minMagnitude) {
      setMeasurement({ type: CookingMeasurementInputActionType.UPDATE_COOKING_MEASUREMENT, payload: { magnitude: minMagnitude } });
    } else if (maxMagnitude && magnitude > maxMagnitude) {
      setMeasurement({ type: CookingMeasurementInputActionType.UPDATE_COOKING_MEASUREMENT, payload: { magnitude: maxMagnitude } });
    } else {
      setMeasurement({ type: CookingMeasurementInputActionType.UPDATE_COOKING_MEASUREMENT, payload: { magnitude } });
    }
  }, []);

  return (
    <Form.Group>
      <Form.Control disabled={disabled} type="number" min={minMagnitude} max={maxMagnitude} value={measurement.magnitude} onChange={onMagnitudeChange} />
      {scoped ? (
        <ScopedMeasurementSelect
          disabled={disabled}
          type={scoped}
          onChange={(unit) => {
            setMeasurement({ type: CookingMeasurementInputActionType.UPDATE_COOKING_MEASUREMENT, payload: { unit } });
          }}
          initialValue={measurement.unit}
        />
      ) : (
        <MeasurementInput
          disabled={disabled}
          selectedValues={[getCookingMeasurement(measurement.unit)]}
          onChange={([value]) => {
            setMeasurement({ type: CookingMeasurementInputActionType.UPDATE_COOKING_MEASUREMENT, payload: { unit: value.unit as CookingMeasurement["unit"] } });
          }}
        />
      )}
    </Form.Group>
  );
}
