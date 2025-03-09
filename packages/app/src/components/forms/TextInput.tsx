import "../styles/TextInput.scss";

import InputLabel, { InputLabelProps } from "./InputLabel";

import Form from "react-bootstrap/esm/Form";
import { FormControlProps } from "react-bootstrap/esm/FormControl";

export type TextInputProps = FormControlProps & {
  label: string;
  error?: string;
  formGroupClassName?: string;
  inputLabelProps?: Omit<InputLabelProps, "children">;
};

export default function TextInput(props: TextInputProps) {
  const { label, inputLabelProps, error, formGroupClassName, ...rest } = props;

  return (
    <Form.Group className={["bp-text_input", formGroupClassName ?? ""].join(" ")}>
      <InputLabel {...inputLabelProps}>{label}</InputLabel>
      <Form.Control {...rest} isInvalid={!!error} />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
