import "../styles/MeasurementInput.scss";

import { ICookingMeasurement, getCookingMeasurementList } from "@biaplanner/shared";
import SelectInput, { Option, SelectInputProps } from "@/components/forms/SelectInput";
import { SelectMethods, SelectProps, SelectState } from "react-dropdown-select";

import { useMemo } from "react";

export type MeasurementInputProps = Omit<SelectInputProps<ICookingMeasurement>, "list" | "idSelector" | "nameSelector" | "dropdownRenderer">;

export default function MeasurementInput(props: MeasurementInputProps) {
  const cookingMeasurements = useMemo(() => getCookingMeasurementList(), []);

  return <SelectInput<ICookingMeasurement> {...props} idSelector={(measurement) => measurement.id} list={cookingMeasurements} nameSelector={(measurement) => measurement.unit} dropdownRenderer={MeasurementInputDropdown} />;
}

function MeasurementInputDropdown(rendererProps: { props: SelectProps<Option>; state: SelectState<Option>; methods: SelectMethods<Option>; additionalMethods: { getValueCounterPart: (option: Option) => ICookingMeasurement } }) {
  const {
    props,

    methods,
    additionalMethods: { getValueCounterPart },
  } = rendererProps;
  const allOptions = props.options;
  const weightOptions = allOptions.filter((option) => {
    const counterpart = getValueCounterPart(option);
    return counterpart.type === "weight";
  });

  const volumeOptions = allOptions.filter((option) => {
    const counterpart = getValueCounterPart(option);
    return counterpart.type === "volume";
  });

  const approximateOptions = allOptions.filter((option) => {
    const counterpart = getValueCounterPart(option);
    return counterpart.type === "approximate";
  });

  return (
    <div className="bp-measurement-input__grid-container">
      <div className="column">
        <div>Weights</div>
        {weightOptions.map((value) => (
          <div className="bp-option" key={value.id} onClick={() => methods.addItem(value)}>
            {value.name}
          </div>
        ))}
      </div>
      <div className="column">
        <div>Volumes</div>
        {volumeOptions.map((value) => (
          <div className="bp-option" key={value.id} onClick={() => methods.addItem(value)}>
            {value.name}
          </div>
        ))}
      </div>
      <div className="column">
        <div>Approximates</div>
        {approximateOptions.map((value) => (
          <div className="bp-option" key={value.id} onClick={() => methods.addItem(value)}>
            {value.name}
          </div>
        ))}
      </div>
    </div>
  );
}
