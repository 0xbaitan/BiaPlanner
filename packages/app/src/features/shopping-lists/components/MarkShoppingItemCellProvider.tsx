import { IProduct, IWriteShoppingItemExtendedDto } from "@biaplanner/shared";

import { CellContext } from "@tanstack/react-table";
import { HTMLAttributes } from "react";
import { useGetProductByIdQuery } from "@/apis/ProductsApi";

export type MarkShoppingItemCellProviderProps = {
  children: (cell: CellContext<IWriteShoppingItemExtendedDto, unknown>, product: IProduct, replacement?: IProduct) => React.ReactNode;
  cell: CellContext<IWriteShoppingItemExtendedDto, unknown>;
};
export default function MarkShoppingItemCellProvider(props: MarkShoppingItemCellProviderProps) {
  const { cell, children } = props;
  const productId = cell.row.original.productId;
  const replacementId = cell.row.original.replacementId;
  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetProductByIdQuery(productId, {
    refetchOnMountOrArgChange: true,
    skip: !productId,
  });
  const {
    data: replacement,
    isLoading: isReplacementLoading,
    isError: isReplacementError,
  } = useGetProductByIdQuery(replacementId!, {
    refetchOnMountOrArgChange: true,
    skip: !replacementId,
  });

  if (isProductLoading || isReplacementLoading) {
    return <div>Loading...</div>;
  }

  if (isProductError || isReplacementError) {
    return <div>Error loading product</div>;
  }

  if (!product || !replacement) {
    return <div>No product available</div>;
  }

  return <>{children(cell, product, replacement)}</>;
}
