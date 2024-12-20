import { useCallback, useState } from "react";

import { FormSelectProps } from "react-bootstrap/FormSelect";
import { IBrand } from "@biaplanner/shared";
import SingleSelect from "./SingleSelect";
import useAccessTokenChangeWatch from "@/hooks/useAccessTokenChangeWatch";
import { useLazyGetBrandsQuery } from "@/apis/BrandsApi";

export type BrandSingleSelectProps = {
  initialValue?: IBrand;
  onChange: (brand: IBrand) => void | Promise<void>;
  error?: string;
} & Omit<FormSelectProps, "value" | "onChange">;

export default function BrandSingleSelect(props: BrandSingleSelectProps) {
  const { initialValue, onChange, error } = props;
  const [getBrands, { isError }] = useLazyGetBrandsQuery();
  const [brandOptions, setBrandOptions] = useState<IBrand[]>([]);
  const watchState = useCallback(async () => {
    if (!(brandOptions && brandOptions.length > 0)) {
      const { data: fetchedBrands } = await getBrands({});
      fetchedBrands && setBrandOptions(fetchedBrands);
    }
  }, [brandOptions, getBrands]);
  useAccessTokenChangeWatch(watchState);

  if (isError || brandOptions.length === 0) return <div>Failed to fetch brands</div>;

  return <SingleSelect<IBrand> initialValue={initialValue} error={error} onChange={onChange} options={brandOptions} idSelector={(brand) => Number(brand?.id)} nameSelector={(brand) => brand?.name} label="Brand" />;
}
