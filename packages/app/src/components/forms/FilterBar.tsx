import "../styles/FilterBar.scss";

import FilterMultiselect, { FilterMultiselectProps } from "./FilterMultiselect";
import React, { HTMLProps } from "react";

import Form from "react-bootstrap/esm/Form";
import { FormCheckInputProps } from "react-bootstrap/esm/FormCheckInput";

export type ProminentFilterProps<T extends object> = FilterMultiselectProps<T>;
function ProminentMultiselect<T extends object>(props: ProminentFilterProps<T>) {
  const { className, ...rest } = props;
  return (
    <div className={["bp-filter_bar__prominent_filter", className].join(" ")}>
      <FilterMultiselect {...rest} />
    </div>
  );
}
export type ProminentCheckboxProps = FormCheckInputProps;
function ProminentCheckbox(props: ProminentCheckboxProps) {
  const { className, ...rest } = props;
  return <Form.Check {...rest} className={["bp-filter_bar__prominent_checkbox", className].join(" ")} />;
}

export type FilterBarProps = HTMLProps<HTMLDivElement>;
function FilterBar(props: FilterBarProps) {
  const { className: propsClass, ...rest } = props;
  return <div {...rest} className={["bp-filter_bar", propsClass].join(" ")} />;
}

FilterBar.ProminentMultiselect = ProminentMultiselect;
FilterBar.ProminentCheckbox = ProminentCheckbox;

export default FilterBar;
