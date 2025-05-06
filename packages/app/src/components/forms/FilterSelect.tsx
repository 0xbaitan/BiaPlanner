import "../styles/FilterMultiselect.scss";

import React, { useState } from "react";
import SelectInput, { SelectInputProps, SelectRendererProps } from "./SelectInput";

import { BiSolidSelectMultiple } from "react-icons/bi";
import Button from "react-bootstrap/esm/Button";
import { FaEraser } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import fuzzysearch from "fuzzysearch";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export type FilterSelectProps<T extends object> = SelectInputProps<T> & {
  selectLabel?: string;
  maxSelectedValuesToShow?: number;
  transformLabel?: (option: T) => React.ReactNode;
  extendFuzzySearch?: (option: T) => string[];
};
export default function FilterSelect<T extends object>(props: FilterSelectProps<T>) {
  return (
    <SelectInput
      className={["bp-filter_multiselect", props.className].join(" ")}
      multi={true}
      {...props}
      contentRenderer={(renderProps) => <FilterSelectContent {...renderProps} multiselectLabel={props.selectLabel} maxSelectedValuesToShow={props.maxSelectedValuesToShow} transformLabel={props.transformLabel} />}
      separator
      dropdownRenderer={(renderProps) => <FilterSelectDropdown {...renderProps} transformLabel={props.transformLabel} extendFuzzySearch={props.extendFuzzySearch} />}
    />
  );
}

function FilterSelectContent<T>(props: SelectRendererProps<T> & { multiselectLabel?: string; maxSelectedValuesToShow?: number; transformLabel?: (option: T) => React.ReactNode }) {
  const {
    props: selectProps,
    state,
    multiselectLabel,
    maxSelectedValuesToShow,
    transformLabel,
    additionalMethods: { getValueCounterPart },
  } = props;
  const selectCount = state.values.length;
  const isAllSelected = selectCount === selectProps.options.length;
  const isMulti = selectProps.multi === true;

  if (!isMulti) {
    const option = state.values[0];
    if (!option) {
      return <span>{selectProps.placeholder}</span>;
    }
    const counterpart = getValueCounterPart(option);
    if (!counterpart) {
      return <span>{selectProps.placeholder}</span>;
    }
    const label = transformLabel ? transformLabel(counterpart) : option.name;

    return state.values.length !== 0 ? <span>{label}</span> : <span>{selectProps.placeholder}</span>;
  }

  if (maxSelectedValuesToShow) {
    const selectedValues = state.values.slice(0, maxSelectedValuesToShow);
    const remainingCount = selectCount - maxSelectedValuesToShow;
    if (selectedValues.length === 0) {
      return (
        <div className="bp-filter_multiselect__content--only-badge">
          <div className="bp-filter_multiselect__placeholder">{selectProps.placeholder ?? "Select..."}</div>
          <div className="bp-filter_multiselect__count-badge">
            <span>0</span>
          </div>
        </div>
      );
    }
    return (
      <div className="bp-filter_multiselect__content--max-selected">
        <div className="bp-filter_multiselect__selected-values_container">
          {selectedValues.map((value) => (
            <span key={value.id} className="bp-filter_multiselect__selected-value">
              {value.name}
            </span>
          ))}
        </div>
        {remainingCount > 0 && <span className="bp-filter_multiselect__remaining-count">+{remainingCount}</span>}
      </div>
    );
  }

  return (
    <div className="bp-filter_multiselect__content">
      {multiselectLabel && <div className="bp-filter_multiselect__label">{multiselectLabel}</div>}
      <div className="bp-filter_multiselect__count-badge">{isAllSelected ? <span>All</span> : <span>{selectCount}</span>}</div>
    </div>
  );
}

function FilterSelectDropdown<T extends object>(props: SelectRendererProps<T> & { transformLabel?: (option: T) => React.ReactNode; extendFuzzySearch?: (option: T) => string[] }) {
  const {
    props: selectProps,
    state,
    methods,
    transformLabel,
    additionalMethods: { getValueCounterPart },
    extendFuzzySearch,
  } = props;
  const { addItem, removeItem, isSelected } = methods;
  const [search, setSearch] = useState(() => state.search ?? "");
  const [optionsParent] = useAutoAnimate({ duration: 300, easing: "ease-in-out" });
  const isAllSelected = state.values.length === selectProps.options.length;
  const isMulti = selectProps.multi === true;
  return (
    <div className="bp-filter_multiselect__dropdown">
      <Form.Control
        value={search}
        placeholder={"Start typing to filter..."}
        onChange={(e) => {
          setSearch(() => e.target.value);
          methods.setSearch(e as React.ChangeEvent<HTMLInputElement>);
        }}
      />
      <div className="bp-filter_multiselect__actions">
        {isMulti &&
          (isAllSelected ? (
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => {
                methods.clearAll();
                setSearch("");
              }}
            >
              <FaEraser size={16} />
              &ensp;Clear all
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => {
                methods.selectAll();
                setSearch("");
              }}
            >
              <BiSolidSelectMultiple />
              &ensp;Select all
            </Button>
          ))}
      </div>
      <div ref={optionsParent} className="bp-filter_multiselect__options">
        {selectProps.options
          .filter((option) => {
            const searchAgainst = extendFuzzySearch ? extendFuzzySearch(getValueCounterPart(option)) : [option.name];
            const term = search.trim().toLowerCase();
            if (term.length === 0) {
              return true;
            }
            return fuzzysearch(term, searchAgainst.join(" ").trim().toLowerCase());
          })
          .sort((a, b) => {
            // Extract the search term from the state and convert it to lowercase for comparison
            const searchTerm = search.trim().toLowerCase();

            // If there is no search term, maintain the current order
            if (searchTerm.length === 0) {
              return 0;
            }

            // Find the index of the search term in the names of the options
            const aIndex = a.name.toLowerCase().indexOf(searchTerm);
            const bIndex = b.name.toLowerCase().indexOf(searchTerm);

            // If both options have the search term at the same position, sort alphabetically
            if (aIndex === bIndex) {
              return a.name.localeCompare(b.name);
            }

            // If one option does not contain the search term, prioritize the one that does
            if (aIndex === -1) {
              return 1; // `a` does not contain the search term, so `b` comes first
            }
            if (bIndex === -1) {
              return -1; // `b` does not contain the search term, so `a` comes first
            }

            // Otherwise, sort by the position of the search term in the names
            return aIndex - bIndex;
          })
          .sort((a, b) => {
            const aSelected = isSelected(a);
            const bSelected = isSelected(b);
            if (aSelected && !bSelected) {
              return -1; // `a` is selected, so it comes first
            }
            if (!aSelected && bSelected) {
              return 1; // `b` is selected, so it comes first
            }
            return 0; // Both are either selected or not selected, so maintain the current order
          })
          .map((option) => {
            const label = transformLabel ? transformLabel(getValueCounterPart(option)) : option.name;
            return (
              <Form.Check
                className="bp-filter_multiselect__option"
                key={option.id}
                label={label}
                checked={isSelected(option)}
                onChange={(e) => {
                  if (e.target.checked) {
                    addItem(option);
                  } else {
                    removeItem(null, option, true);
                  }
                }}
                type={selectProps.multi === true ? "checkbox" : "radio"}
              />
            );
          })}
      </div>
    </div>
  );
}
