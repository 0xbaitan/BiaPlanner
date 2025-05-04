import "../styles/CookingMeasurementInput.scss";

import { CookingMeasurement, CookingMeasurementType, Weights, getCookingMeasurement } from "@biaplanner/shared";
import React, { useCallback, useEffect, useReducer } from "react";

import Form from "react-bootstrap/Form";
import MeasurementInput from "@/features/recipe-management/_recipes/components/MeasurementInput";
import ScopedMeasurementSelect from "@/features/meal-planning/_meal-plans/components/ScopedMeasurementSelect";

export type CookingMeasurementInputProps = {
  initialValue?: CookingMeasurement;
  onChange: (value: CookingMeasurement) => void;
  scoped?: CookingMeasurementType | false;
  disabled?: boolean;
  minMagnitude?: number;
  maxMagnitude?: number;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">;

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
  const { initialValue, onChange, scoped, disabled, minMagnitude, maxMagnitude, className, ...rest } = props;
  const [measurement, setMeasurement] = useReducer((state: CookingMeasurementInputState, action: CookingMeasurementInputAction) => CookingMeasurementReducer(state, action), initialValue ?? initialState);

  useEffect(() => {
    onChange(measurement);
  }, [measurement, onChange]);

  const onMagnitudeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [maxMagnitude, minMagnitude]
  );

  return (
    <Form.Group className={["bp-cooking_measurement_input", className].join(" ")} {...rest}>
      <Form.Control className="bp-cooking_measurement_input__magnitude" disabled={disabled} type="number" min={minMagnitude} max={maxMagnitude} value={measurement.magnitude} onChange={onMagnitudeChange} />
      {scoped ? (
        <ScopedMeasurementSelect
          className="bp-cooking_measurement_input__unit"
          disabled={disabled}
          type={scoped}
          onChange={(unit) => {
            setMeasurement({ type: CookingMeasurementInputActionType.UPDATE_COOKING_MEASUREMENT, payload: { unit } });
          }}
          initialValue={measurement.unit}
        />
      ) : (
        <MeasurementInput
          className="bp-cooking_measurement_input__unit"
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
