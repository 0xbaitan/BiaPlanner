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
  console.log("cuisineOptions", cuisineOptions);

  const [selectedValue, setSelectedValue] = useState<ICuisine | undefined>();

  useEffect(() => {
    if (isSuccess) {
      const populatedCuisine = cuisineOptions?.find((cuisine) => cuisine.id === defaultValue?.id!);
      setSelectedValue(populatedCuisine);
    }
  }, [defaultValue, cuisineOptions, isSuccess]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading cuisines</div>;
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
          setSelectedValue(selectedValue);
          onChange(selectedValue);
        }}
        multi={false}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
