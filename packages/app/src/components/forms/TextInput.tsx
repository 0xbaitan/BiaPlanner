import "../styles/TextInput.scss";

import InputLabel, { InputLabelProps } from "./InputLabel";
import React, { useCallback } from "react";

import Form from "react-bootstrap/esm/Form";
import { FormControlProps } from "react-bootstrap/esm/FormControl";

export type TextInputProps = FormControlProps & {
  label: string;
  error?: string;
  formGroupClassName?: string;
  inputLabelProps?: Omit<InputLabelProps, "children">;
};

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const { label, inputLabelProps, error, formGroupClassName, ...rest } = props;
  const [text, setText] = React.useState<string>(rest.value as string);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value ?? "";
      setText(value);
      if (rest.onChange) {
        rest.onChange(e);
      }
    },
    [rest]
  );

  return (
    <Form.Group className={["bp-text_input", formGroupClassName ?? ""].join(" ")}>
      <InputLabel {...inputLabelProps}>{label}</InputLabel>
      <Form.Control {...rest} isInvalid={!!error} ref={ref} value={text} onChange={handleChange} type="text" />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
});

const MemoizedTextInput = React.memo(TextInput);

export default TextInput;
export { MemoizedTextInput };
