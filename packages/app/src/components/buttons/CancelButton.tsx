import { Button, ButtonProps } from "react-bootstrap";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export type CancelButtonProps = ButtonProps & {
  label?: string;
  path: RoutePaths;
  pathId?: string;
};

export default function CancelButton(props: CancelButtonProps) {
  const { label, path, pathId } = props;
  const navigate = useNavigate();
  const resolvedPath = pathId
    ? fillParametersInPath(path, {
        id: pathId,
      })
    : path;

  return (
    <Button onClick={() => navigate(resolvedPath)} variant="outline-secondary">
      <MdCancel />
      <span className="ms-2">{label ?? "Cancel"}</span>
    </Button>
  );
}
