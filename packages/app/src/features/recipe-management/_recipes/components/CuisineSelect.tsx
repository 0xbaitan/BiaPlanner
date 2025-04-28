import FilterSelect, { FilterSelectProps } from "@/components/forms/FilterSelect";
import InputLabel, { InputLabelProps } from "@/components/forms/InputLabel";
import { useEffect, useMemo, useState } from "react";

import Form from "react-bootstrap/esm/Form";
import { ICuisine } from "@biaplanner/shared";
import { useGetCuisinesQuery } from "@/apis/CuisinesApi";

export type CuisineSelectProps = {
  defaultValue?: Pick<ICuisine, "id">;
  onChange: (cuisine: ICuisine) => void;
  error?: string;
  inputLabelProps?: Omit<InputLabelProps, "children">;
} & Omit<FilterSelectProps<ICuisine>, "list" | "idSelector" | "nameSelector" | "selectedValues" | "onChange">;

export default function CuisineSelect(props: CuisineSelectProps) {
  const { onChange, defaultValue, inputLabelProps, error } = props;
  const { data: cuisineOptions, isSuccess, isLoading, isError } = useGetCuisinesQuery();

  const selectedValue = useMemo(() => {
    if (!defaultValue) return null;
    const matchingCuisine = cuisineOptions?.find((cuisine) => cuisine.id === defaultValue.id);
    return matchingCuisine ?? null;
  }, [cuisineOptions, defaultValue]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading cuisines</div>;
  }

  if (!cuisineOptions || cuisineOptions?.length === 0) {
    return <div>No cuisines available</div>;
  }

  return (
    <Form.Group>
      <InputLabel {...inputLabelProps}>Cuisine</InputLabel>
      <FilterSelect<ICuisine>
        list={cuisineOptions}
        idSelector={(item) => item.id}
        nameSelector={(item) => item.name}
        selectedValues={selectedValue ? [selectedValue] : []}
        onChange={([selectedValue]) => {
          if (selectedValue) {
            onChange(selectedValue);
          }
        }}
        multi={false}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
