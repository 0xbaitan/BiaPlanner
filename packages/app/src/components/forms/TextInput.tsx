import Form from "react-bootstrap/esm/Form";
import { FormControlProps } from "react-bootstrap/esm/FormControl";
export type TextInputProps = FormControlProps & {
  label: string;
  error?: string;
};

export default function TextInput(props: TextInputProps) {
  const { label, error, ...rest } = props;

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control {...rest} isInvalid={!!error} />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
