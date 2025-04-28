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

  const [selectedValue, setSelectedValue] = useState<ICuisine | undefined>(undefined);

  useEffect(() => {
    if (defaultValue && cuisineOptions) {
      const matchingCuisine = cuisineOptions.find((cuisine) => cuisine.id === defaultValue.id);
      if (matchingCuisine && selectedValue?.id !== matchingCuisine.id) {
        setSelectedValue(matchingCuisine);
      }
    }
  }, [cuisineOptions, defaultValue, selectedValue?.id]);

  useEffect(() => {
    if (selectedValue) {
      onChange(selectedValue);
    }
  }, [onChange, selectedValue]);

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
          setSelectedValue(selectedValue);
        }}
        multi={false}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
