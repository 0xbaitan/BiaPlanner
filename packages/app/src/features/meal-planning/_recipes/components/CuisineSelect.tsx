import Form from "react-bootstrap/esm/Form";
import { FormSelectProps } from "react-bootstrap/esm/FormSelect";
import { ICuisine } from "@biaplanner/shared";
import SelectInput from "@/components/forms/SelectInput";
import { useGetCuisinesQuery } from "@/apis/CuisinesApi";

export type CuisineSelectProps = {
  initialValueId?: string;
  onChange: (cuisine: ICuisine) => void | Promise<void>;
  error?: string;
} & Omit<FormSelectProps, "value" | "onChange">;

export default function CuisineSelect(props: CuisineSelectProps) {
  const { onChange, error } = props;
  const { data: cuisineOptions, isSuccess } = useGetCuisinesQuery();

  return (
    <Form.Group>
      <Form.Label>Cuisines</Form.Label>
      <SelectInput<ICuisine>
        list={isSuccess ? cuisineOptions : []}
        onChange={([selectedCuisine]) => {
          onChange(selectedCuisine);
        }}
        idSelector={(cuisine) => String(cuisine?.id)}
        nameSelector={(cuisine) => cuisine?.name}
        noDataLabel="No cuisines available"
        multi={false}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
