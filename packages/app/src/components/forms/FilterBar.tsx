import "../styles/FilterBar.scss";

import Button, { ButtonProps } from "react-bootstrap/esm/Button";
import FilterSelect, { FilterSelectProps } from "./FilterSelect";
import { FormCheck, FormCheckProps, FormControlProps, FormLabel, FormLabelProps, FormSelect, FormSelectProps } from "react-bootstrap";
import React, { HTMLProps } from "react";

import DropdownPane from "../DropdownPane";
import { FaSort } from "react-icons/fa";
import { IoFilter as IoFil } from "react-icons/io5";
import { RxReset } from "react-icons/rx";

export type FilterBarProps = HTMLProps<HTMLDivElement> & {
  prominentFiltersGroup?: React.ReactNode;
  hiddenFiltersGroup?: React.ReactNode;
  sorterGroup?: React.ReactNode;
  showResetButton?: boolean;
  onResetFilters?: () => void;
};

function FilterBar(props: FilterBarProps) {
  const { className: propsClass, prominentFiltersGroup, hiddenFiltersGroup, sorterGroup, showResetButton = false, onResetFilters, ...rest } = props;

  return (
    <div {...rest} className={["bp-filter_bar", propsClass].join(" ")}>
      {/* Prominent Filters */}
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
          {showResetButton && (
            <Button variant="outline-danger" className="bp-filter_bar__reset_button" onClick={onResetFilters}>
              <RxReset size={16} className="bp-filter_bar__reset_icon" />
              <span className="bp-filter_bar__reset_text">Reset filters</span>
            </Button>
          )}
        </div>
      )}

      {/* Sorter */}
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

// Subcomponents for FilterBar

export type FilterGroupProps = HTMLProps<HTMLDivElement> & {
  type: "prominent-filters" | "sorter" | "hidden-filters";
};
function FilterGroup(props: FilterGroupProps) {
  const { className, type, ...rest } = props;
  return <div {...rest} className={["bp-filter_bar__filters_group", type, className].join(" ")} />;
}

export type OrdinarySelectProps = FormSelectProps & {
  label: string;
  labelProps?: FormLabelProps;
};
function OrdinarySelect(props: OrdinarySelectProps) {
  const { className, label, labelProps, ...rest } = props;
  return (
    <div className="bp-filter_bar__ordinary_select_wrapper">
      <FormLabel className={["bp-filter_bar__ordinary_select_label", labelProps?.className].join(" ")} {...labelProps}>
        {label}
      </FormLabel>
      <FormSelect {...rest} className={["bp-filter_bar__ordinary_select", className].join(" ")} />
    </div>
  );
}

export type CheckboxProps = FormCheckProps & {
  label: string;
  labelControls?: FormLabelProps;
};
function FilterCheckbox(props: CheckboxProps) {
  const { className, label, ...rest } = props;
  return (
    <div className="bp-filter_bar__checkbox_wrapper">
      <FormCheck {...rest} className={["bp-filter_bar__checkbox", className].join(" ")} />
      <FormCheck.Label className="bp-filter_bar__checkbox_label" {...rest.labelControls}>
        {label}
      </FormCheck.Label>
    </div>
  );
}

export type SortSelectProps = FormSelectProps;

function SortSelect(props: SortSelectProps) {
  const { className, ...rest } = props;
  return <FormSelect {...rest} className={["bp-filter_bar__sort_select", className].join(" ")} />;
}

function FilterSelectInput<T extends object>(props: FilterSelectProps<T>) {
  return <FilterSelect {...props} className="bp-filter_bar__filter_select" />;
}

// Attach subcomponents to FilterBar
FilterBar.Group = FilterGroup;
FilterBar.OrdinarySelect = OrdinarySelect;
FilterBar.Checkbox = FilterCheckbox;
FilterBar.Sorter = SortSelect;
FilterBar.FilterSelect = FilterSelectInput;

export default FilterBar;
