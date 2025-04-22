import "../styles/MeasurementInput.scss";

import { ICookingMeasurement, getCookingMeasurement, getCookingMeasurementList, getMeasurementLabel } from "@biaplanner/shared";
import { Option, SelectInputProps, SelectRendererProps } from "@/components/forms/SelectInput";
import { SelectMethods, SelectProps, SelectState } from "react-dropdown-select";
import { useMemo, useState } from "react";

import { BiSolidSelectMultiple } from "react-icons/bi";
import { Button } from "react-bootstrap";
import { FaEraser } from "react-icons/fa6";
import FilterSelect from "@/components/forms/FilterSelect";
import Form from "react-bootstrap/Form";
import SelectInput from "@/components/forms/SelectInput";
import fuzzysearch from "fuzzysearch";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export type MeasurementInputProps = Omit<SelectInputProps<ICookingMeasurement>, "list" | "idSelector" | "nameSelector" | "dropdownRenderer">;

export default function MeasurementInput(props: MeasurementInputProps) {
  const cookingMeasurements = useMemo(() => getCookingMeasurementList(), []);

  return (
    <FilterSelect<ICookingMeasurement>
      {...props}
      idSelector={(measurement) => measurement.id}
      list={cookingMeasurements}
      nameSelector={(measurement) => measurement.unit}
      extendFuzzySearch={(measurement) => [measurement.unit, measurement.type, getMeasurementLabel(measurement.unit)]}
      transformLabel={(measurement) => {
        const unitLabel = getMeasurementLabel(measurement.unit);
        const unitType = getCookingMeasurement(measurement.unit);
        const unitTypeLabel = unitType.type === "weight" ? "Weight" : unitType.type === "volume" ? "Volume" : "Approximate";

        return (
          <div className="bp-measurement-input__label">
            <div className="bp-measurements-input__label__unit"> {unitLabel}</div>
            <div className="bp-measurement-input__label__unit_type">{unitTypeLabel}</div>
          </div>
        );
      }}
      multi={false}
    />
  );
}
