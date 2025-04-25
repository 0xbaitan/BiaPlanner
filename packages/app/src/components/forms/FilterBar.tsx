import "../styles/FilterBar.scss";

import Button, { ButtonProps } from "react-bootstrap/esm/Button";
import FilterMultiselect, { FilterSelectProps } from "./FilterSelect";
import React, { HTMLProps } from "react";

import DropdownPane from "../DropdownPane";
import { FaSort } from "react-icons/fa";
import Form from "react-bootstrap/esm/Form";
import { FormCheckProps } from "react-bootstrap/esm/FormCheck";
import { FormSelectProps } from "react-bootstrap/esm/FormSelect";
import { IoFilter as IoFil } from "react-icons/io5";
import { RxReset } from "react-icons/rx";

function FilterSelect<T extends object>(props: FilterSelectProps<T>) {
  const { className, ...rest } = props;
  return (
    <div>
      <FilterMultiselect className={["bp-filter_bar__filter_select", className].join(" ")} {...rest} />
    </div>
  );
}

export type OrdinarySelectProps = FormSelectProps & {
  label: string;
};
function OrdinarySelect(props: OrdinarySelectProps) {
  const { className, ...rest } = props;
  return (
    <div className="bp-filter_bar__ordinary_select_wrapper">
      <label className="bp-filter_bar__ordinary_select_label">{props.label}</label>
      <Form.Select {...rest} className={["bp-filter_bar__ordinary_select", className].join(" ")} />
    </div>
  );
}

export type CheckboxProps = FormCheckProps & {
  label: string;
};
function FilterCheckbox(props: CheckboxProps) {
  const { className, ...rest } = props;
  return (
    <div>
      <Form.Check {...rest} className={["bp-filter_bar__checkbox", className].join(" ")} />
    </div>
  );
}
export type FilterGroupProps = HTMLProps<HTMLDivElement> & {
  type: "prominent-filters" | "sorter" | "hidden-filters";
};
function FilterGroup(props: FilterGroupProps) {
  const { className, type, ...rest } = props;
  return <div {...rest} className={["bp-filter_bar__filters_group", type, className].join(" ")} />;
}

export type FilterResetButtonProps = ButtonProps;

function FilterResetButton(props: FilterResetButtonProps) {
  const { className, ...rest } = props;
  return (
    <Button variant="outline-danger" {...rest} className={["bp-filter_bar__reset_button", className].join(" ")}>
      <RxReset size={16} className="bp-filter_bar__reset_icon" />
      <span className="bp-filter_bar__reset_text">Reset filters</span>
    </Button>
  );
}
export type FilterBarProps = HTMLProps<HTMLDivElement>;

function FilterBar(props: FilterBarProps) {
  const { className: propsClass, children, ...rest } = props;

  const prominentFiltersGroup = React.Children.toArray(children).find((child) => {
    if (!React.isValidElement(child)) return false;
    return child.type === FilterGroup && child.props.type === "prominent-filters";
  }) as React.ReactElement | null;

  const hiddenFiltersGroup = React.Children.toArray(children).find((child) => {
    if (!React.isValidElement(child)) return false;
    return child.type === FilterGroup && child.props.type === "hidden-filters";
  }) as React.ReactElement | null;

  const sorterGroup = React.Children.toArray(children).find((child) => {
    if (!React.isValidElement(child)) return false;
    return child.type === FilterGroup && child.props.type === "sorter";
  }) as React.ReactElement | null;

  const resetFiltersButton = React.Children.toArray(children).find((child) => {
    if (!React.isValidElement(child)) return false;
    return child.type === FilterResetButton;
  }) as React.ReactElement | null;
  return (
    <div {...rest} className={["bp-filter_bar", propsClass].join(" ")}>
      {prominentFiltersGroup && (
        <div className="bp-filter_bar__filter_area">
          <div className="bp-filter_bar__filter_title">
            <IoFil className="bp-filter_bar__filter_icon" />

            <span className="bp-filter_bar__filter_text">Filter by:</span>
          </div>
          {prominentFiltersGroup}
          {hiddenFiltersGroup && (
            <DropdownPane className="bp-filter_bar__hidden_filters" toggleId="hidden-filters" toggleText="More filters" contentProps={{ className: "bp-filter_bar__hidden_filters_content" }}>
              {hiddenFiltersGroup}
            </DropdownPane>
          )}

          {resetFiltersButton && <>{resetFiltersButton}</>}
        </div>
      )}
      {sorterGroup && (
        <div className="bp-filter_bar__sort_area">
          <div className="bp-filter_bar__sort_title">
            <FaSort className="bp-filter_bar__sort_icon" />
            <span className="bp-filter_bar__sort_text">Sort by:</span>
          </div>
          {sorterGroup}
        </div>
      )}
    </div>
  );
}

export type SortSelectProps = FormSelectProps;

function SortSelect(props: SortSelectProps) {
  const { className, ...rest } = props;
  return <Form.Select {...rest} className={["bp-filter_bar__sort_select", className].join(" ")} />;
}

FilterBar.OrdinarySelect = OrdinarySelect;
FilterBar.Select = FilterSelect;
FilterBar.Checkbox = FilterCheckbox;
FilterBar.Sorter = SortSelect;
FilterBar.Group = FilterGroup;
FilterBar.ResetButton = FilterResetButton;

export default FilterBar;
