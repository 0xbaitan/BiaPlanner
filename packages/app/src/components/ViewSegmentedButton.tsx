import "./styles/ViewSegmentedButton.scss";

import ButtonGroup, { ButtonGroupProps } from "react-bootstrap/esm/ButtonGroup";

import { BsGridFill } from "react-icons/bs";
import Button from "react-bootstrap/esm/Button";
import { FaTableCells } from "react-icons/fa6";

export type ViewType = "table" | "grid";
export type ViewSegmentedButtonProps = Omit<ButtonGroupProps, "children"> & {
  view?: ViewType;
  onChange?: (view: "table" | "grid") => void;
};
export default function ViewSegmentedButton(props: ViewSegmentedButtonProps) {
  const { className, view, onChange, ...rest } = props;
  return (
    <ButtonGroup {...rest} className={`bp-view_segmented_button ${className || ""}`}>
      <button className={`bp-view_segmented_button__item ${view === "table" ? "active" : ""}`} onClick={() => onChange?.("table")}>
        <FaTableCells size={16} />
        &ensp;Table view
      </button>
      <button className={`bp-view_segmented_button__item ${view === "grid" ? "active" : ""}`} onClick={() => onChange?.("grid")}>
        <BsGridFill size={16} />
        &ensp;Grid view
      </button>
    </ButtonGroup>
  );
}
