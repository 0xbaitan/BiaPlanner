import "../styles/InputLabel.scss";

import FormLabel, { FormLabelProps } from "react-bootstrap/FormLabel";

import { BsAsterisk } from "react-icons/bs";

export type InputLabelProps = FormLabelProps & {
  required?: boolean;
};

export default function InputLabel(props: InputLabelProps) {
  const { className, required, children, ...rest } = props;

  return (
    <FormLabel className={[required ? "bp-input_label--required" : "bp-input_label", className ?? ""].join(" ")} {...rest}>
      {children}
    </FormLabel>
  );
}
