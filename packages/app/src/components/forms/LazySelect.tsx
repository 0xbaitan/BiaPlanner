import SelectInput, { Option, SelectInputProps, SelectRendererProps } from "./SelectInput";
import { SelectMethods, SelectProps, SelectState } from "react-dropdown-select";
import { useCallback, useState } from "react";

import Form from "react-bootstrap/Form";
import { ICookingMeasurement } from "@biaplanner/shared";
import MeasurementInput from "@/features/meal-planning/_recipes/components/MeasurementInput";

export type LazySelectProps<T extends object> = Omit<SelectInputProps<T>, "list"> & {
  loadList: (searchText: string) => Promise<T[]>;
  isLoading?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
};

export default function LazySelect<T extends object>(props: LazySelectProps<T>) {
  const { loadList, isError, isSuccess, isLoading, selectedValues, ...selectInputProps } = props;

  return (
    <SelectInput<T>
      {...selectInputProps}
      list={[]}
      searchFn={({ state, additionalMethods: { addOption } }) => {
        const search = state.search;
        loadList(search).then((data) => {
          data.forEach((item) => {
            addOption(item);
          });
        });
        return state.values;
      }}
    />
  );
}
