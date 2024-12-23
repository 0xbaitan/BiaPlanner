import { FormSelectProps } from "react-bootstrap/esm/FormSelect";
import { IProduct } from "@biaplanner/shared";
import SingleSelect from "./SingleSelect";
import { useGetProductsQuery } from "@/apis/ProductsApi";

export type ProductsSingleSelectProps = {
  initialValue?: IProduct;
  onChange: (brand: IProduct) => void | Promise<void>;
  error?: string;
} & Omit<FormSelectProps, "value" | "onChange">;

export default function ProductsSingleSelect(props: ProductsSingleSelectProps) {
  const { initialValue, onChange, error } = props;

  const { data: productOptions, isError } = useGetProductsQuery({});

  if (isError || !productOptions || productOptions.length === 0) return <div>Failed to fetch products</div>;

  return <SingleSelect<IProduct> initialValue={initialValue} error={error} onChange={onChange} options={productOptions} idSelector={(product) => Number(product?.id)} nameSelector={(product) => product?.name} label="Product" />;
}
