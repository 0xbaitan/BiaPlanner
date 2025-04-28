import { Button, ButtonProps } from "react-bootstrap";

import { FaSave } from "react-icons/fa";

export type SaveButtonProps = ButtonProps & {
  label: string;
};

export default function SaveButton(props: SaveButtonProps) {
  const { label, ...rest } = props;
  return (
    <Button {...rest} type="submit">
      <FaSave />
      <span className="ms-2">{label}</span>
    </Button>
  );
}
