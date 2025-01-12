import { FormSelectProps } from "react-bootstrap/esm/FormSelect";
import { ICuisine } from "@biaplanner/shared";
import SingleSelect from "@/components/forms/SingleSelect";
import { useGetCuisinesQuery } from "@/apis/CuisinesApi";

export type CuisineSelectProps = {
  initialValueId?: string;
  onChange: (cuisine: ICuisine) => void | Promise<void>;
  error?: string;
} & Omit<FormSelectProps, "value" | "onChange">;

export default function CuisineSelect(props: CuisineSelectProps) {
  const { initialValueId, onChange, error } = props;
  const { data: cuisineOptions, isError } = useGetCuisinesQuery();
  const initialValue = cuisineOptions?.find((cuisine) => cuisine.id === initialValueId);
  if (isError || !cuisineOptions || cuisineOptions.length === 0) return <div>Failed to fetch cuisines</div>;

  return <SingleSelect<ICuisine> initialValue={initialValue} error={error} onChange={onChange} options={cuisineOptions} idSelector={(brand) => Number(brand?.id)} nameSelector={(brand) => brand?.name} label="Cuisine" />;
}
