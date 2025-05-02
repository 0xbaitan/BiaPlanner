import { useCallback } from "react";
import { useLazyGetProductByIdQuery } from "@/apis/ProductsApi";

export function useGetProduct() {
  const [getProduct] = useLazyGetProductByIdQuery();

  const getProductById = useCallback(
    async (id: string) => {
      const product = await getProduct(id).unwrap();
      return product;
    },
    [getProduct]
  );
  return getProductById;
}
