import InputLabel, { InputLabelProps } from "@/components/forms/InputLabel";
import { useEffect, useMemo, useState } from "react";

import FilterSelect from "@/components/forms/FilterSelect";
import Form from "react-bootstrap/esm/Form";
import { FormSelectProps } from "react-bootstrap/esm/FormSelect";
import { ICuisine } from "@biaplanner/shared";
import SelectInput from "@/components/forms/SelectInput";
import { useGetCuisinesQuery } from "@/apis/CuisinesApi";

export type CuisineSelectProps = {
  defaultValue?: Pick<ICuisine, "id">;
  onChange: (cuisine: ICuisine) => void;
  error?: string;
  inputLabelProps?: Omit<InputLabelProps, "children">;
} & Omit<FormSelectProps, "value" | "onChange" | "defaultValue">;

export default function CuisineSelect(props: CuisineSelectProps) {
  const { onChange, defaultValue, inputLabelProps, error } = props;
  const { data: cuisineOptions, isSuccess, isLoading, isError } = useGetCuisinesQuery();

  const defaultCuisine = useMemo(() => {
    if (defaultValue && isSuccess && cuisineOptions) {
      return cuisineOptions.find((cuisine) => cuisine.id === defaultValue.id);
    }
    return undefined;
  }, [defaultValue, isSuccess, cuisineOptions]);

  const [selectedValue, setSelectedValue] = useState<ICuisine | undefined>(defaultCuisine);

  console.log("CuisineSelect", { defaultCuisine, selectedValue });
  useEffect(() => {
    if (defaultCuisine) {
      setSelectedValue(defaultCuisine);
    }
  }, [defaultCuisine]);

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
        list={cuisineOptions ?? []}
        idSelector={(item) => item.id}
        nameSelector={(item) => item.name}
        selectedValues={selectedValue ? [selectedValue] : []}
        onChange={([selectedValue]) => {
          setSelectedValue(() => selectedValue);
          onChange(selectedValue);
        }}
        multi={false}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
