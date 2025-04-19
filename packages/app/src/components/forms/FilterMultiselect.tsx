import "../styles/FilterMultiselect.scss";

import React, { useEffect, useRef, useState } from "react";
import SelectInput, { SelectInputProps, SelectRendererProps } from "./SelectInput";

import { BiSolidSelectMultiple } from "react-icons/bi";
import Button from "react-bootstrap/esm/Button";
import { FaEraser } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import { IBaseEntity } from "@biaplanner/shared";
import fuzzysearch from "fuzzysearch";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export type FilterMultiselectProps<T extends IBaseEntity> = SelectInputProps<T>;
export default function FilterMultiselect<T extends IBaseEntity>(props: FilterMultiselectProps<T>) {
  const [focused, setFocused] = useState(false);
  return <SelectInput {...props} contentRenderer={FilterMultiselectContent} separator dropdownRenderer={FilterMultiselectDropdown} searchable multi />;
}

function FilterMultiselectContent<T extends IBaseEntity>(props: SelectRendererProps<T>) {
  const { props: selectProps, state, methods, additionalMethods } = props;
  return (
    <div>
      {selectProps.labelField && <Form.Label>{selectProps.labelField}</Form.Label>} hi {selectProps.values.length} selected
    </div>
  );
}

function FilterMultiselectDropdown<T extends IBaseEntity>(props: SelectRendererProps<T>) {
  const { props: selectProps, state, methods, additionalMethods } = props;
  const { addItem, removeItem, isSelected } = methods;
  const [search, setSearch] = useState(() => state.search ?? "");
  const [optionsParent] = useAutoAnimate({ duration: 300, easing: "ease-in-out" });
  const isAllSelected = state.values.length === selectProps.options.length;

  return (
    <div className="p-2">
      <div>
        {isAllSelected ? (
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
        )}
      </div>
      <Form.Control
        onChange={(e) => {
          setSearch(() => e.target.value);
          methods.setSearch(e as React.ChangeEvent<HTMLInputElement>);
        }}
      />

      <div ref={optionsParent}>
        {selectProps.options
          .filter((option) => {
            const term = search.trim().toLowerCase();
            if (term.length === 0) {
              return true;
            }
            return fuzzysearch(term, option.name.toLowerCase());
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
          .map((option, index) => {
            return (
              <Form.Check
                key={option.id}
                label={option.name}
                checked={isSelected(option)}
                onChange={(e) => {
                  if (e.target.checked) {
                    addItem(option);
                  } else {
                    removeItem(null, option, true);
                  }
                }}
                type="checkbox"
              />
            );
          })}
      </div>
    </div>
  );
}
