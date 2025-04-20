import "./styles/DropdownPane.scss";

import Dropdown, { DropdownProps } from "react-bootstrap/Dropdown";

import { DropdownMenuProps } from "react-bootstrap/esm/DropdownMenu";
import { DropdownToggleProps } from "react-bootstrap/esm/DropdownToggle";
import React from "react";

export type DropdownPaneProps = DropdownProps & {
  toggleId: string;
  toggleProps?: DropdownToggleProps;
  toggleText: string;
  contentProps?: DropdownMenuProps;
};
export default function DropdownPane(props: DropdownPaneProps) {
  const { toggleId: id, className, toggleProps, contentProps, toggleText, children } = props;
  return (
    <Dropdown className={`bp-dropdown_pane ${className || ""}`} {...props}>
      <Dropdown.Toggle variant="secondary" id={id} {...toggleProps} className={`bp-dropdown_pane__toggle ${toggleProps?.className || ""}`}>
        {toggleText}
      </Dropdown.Toggle>

      <Dropdown.Menu className="bp-dropdown_pane__content" {...contentProps}>
        {children}
      </Dropdown.Menu>
    </Dropdown>
  );
}
