import { useCallback, useEffect, useMemo, useState } from "react";

import Form from "react-bootstrap/Form";
import { FormSelectProps } from "react-bootstrap/FormSelect";

export type SingleSelectProps<T> = {
  options: T[];
  label: string;
  idSelector: (item: T) => number;
  nameSelector: (item: T) => string;
  initialValue?: T;
  onChange?: (selectedItem: T) => void | Promise<void>;
  error?: string;
} & Omit<FormSelectProps, "value" | "onChange">;

export default function SingleSelect<T>(props: SingleSelectProps<T>) {
  const { options, idSelector, nameSelector, initialValue, onChange, error, label, size, ...selectProps } = props;
  const [selectedItem, setSelectedItem] = useState<number>(() => {
    return initialValue ? idSelector(initialValue) : idSelector(options[0]);
  });
  const singleSelectOptions = useMemo(() => {
    return options.map((option) => (
      <option key={idSelector(option)} value={idSelector(option)}>
        {nameSelector(option)}
      </option>
    ));
  }, [options, idSelector, nameSelector]);

  const getItem = useCallback(
    (id: number) => {
      return options.find((option) => idSelector(option) === id);
    },
    [options, idSelector]
  );

  useEffect(() => {
    onChange && onChange(getItem(selectedItem) as T);
  }, [getItem, onChange, selectedItem]);

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Select
        {...selectProps}
        isInvalid={!!error}
        value={selectedItem}
        onChange={(e) => {
          const id = Number(e.target.value);
          setSelectedItem(id);
        }}
      >
        {singleSelectOptions}
      </Form.Select>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}
