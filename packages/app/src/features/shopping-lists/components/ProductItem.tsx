import { DeepPartial } from "react-hook-form";
import { IProduct } from "@biaplanner/shared";

export type ProductItemProps = {
  product: DeepPartial<IProduct>;
};

export default function ProductItem(props: ProductItemProps) {
  const { product } = props;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-semibold">{product.name}</div>
      <div className="text-xs text-gray-500">{product.description}</div>
    </div>
  );
}
