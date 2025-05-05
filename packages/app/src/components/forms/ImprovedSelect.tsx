import { Controller, ControllerProps, FieldValues } from "react-hook-form";
import { FormGroup, FormLabel } from "react-bootstrap";
import Select, { SelectMethods, SelectProps, SelectState } from "react-dropdown-select";

import { ErrorMessage } from "@hookform/error-message";

export type ImprovedSelectProps<T extends object | string, U extends FieldValues> = Omit<SelectProps<T>, "values" | "onChange"> & {
  controllerProps: ControllerProps<U>;
  label: string;
};

export default function ImprovedSelect<T extends object, U extends FieldValues>(props: ImprovedSelectProps<T, U>) {
  const { className, label, ...rest } = props;

  return (
    <Controller
      {...rest.controllerProps}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const fieldValue = Array.isArray(value) ? value : [value];

        return (
          <FormGroup>
            <FormLabel>{label}</FormLabel>

            <Select<T> {...rest} className={`improved-select ${className}`} onChange={onChange} values={fieldValue} />
            <ErrorMessage name={rest.controllerProps.name} errors={error} render={({ message }) => <p className="text-danger">{message}</p>} />
          </FormGroup>
        );
      }}
    />
  );
}
