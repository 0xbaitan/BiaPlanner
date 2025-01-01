import { FormSelectProps } from "react-bootstrap/FormSelect";
import { IBrand } from "@biaplanner/shared";
import SingleSelect from "./SingleSelect";
import { useGetBrandsQuery } from "@/apis/BrandsApi";

export type BrandSingleSelectProps = {
  initialValueId?: string;
  onChange: (brand: IBrand) => void | Promise<void>;
  error?: string;
} & Omit<FormSelectProps, "value" | "onChange">;

export default function BrandSingleSelect(props: BrandSingleSelectProps) {
  const { initialValueId, onChange, error } = props;
  const { data: brandOptions, isError } = useGetBrandsQuery();
  const initialValue = brandOptions?.find((brand) => brand.id === initialValueId);
  if (isError || !brandOptions || brandOptions.length === 0) return <div>Failed to fetch brands</div>;

  return <SingleSelect<IBrand> initialValue={initialValue} error={error} onChange={onChange} options={brandOptions} idSelector={(brand) => Number(brand?.id)} nameSelector={(brand) => brand?.name} label="Brand" />;
}
