import MultiselectInput, { MultiselectInputProps } from "./MultiselectInput";
import { useCallback, useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import { IProductCategory } from "@biaplanner/shared";
import useAccessTokenChangeWatch from "@/hooks/useAccessTokenChangeWatch";
import { useLazyGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";

export type ProductCategoryMultiselectProps = Omit<MultiselectInputProps<IProductCategory>, "list" | "idSelector" | "nameSelector" | "selectedValues" | "onSelect"> & {
  initialValues?: IProductCategory[];
  onSelectionChange: (productCategories: IProductCategory[]) => void | Promise<void>;
  error?: string;
};

export default function ProductCategoryMultiselect(props: ProductCategoryMultiselectProps) {
  const { initialValues, onSelectionChange, error } = props;
  const [getProductCategories, { isError }] = useLazyGetProductCategoriesQuery();
  const [productCategories, setProductCategories] = useState<IProductCategory[]>([]);
  const [selectedProductCategories, setSelectedProductCategories] = useState<IProductCategory[]>(() => (initialValues ? [...initialValues] : []));
  const watchState = useCallback(async () => {
    if (!(productCategories && productCategories.length > 0)) {
      const { data: fetchedCategories } = await getProductCategories({});
      productCategories && setProductCategories(fetchedCategories ?? []);
    }
  }, [getProductCategories, productCategories]);

  useAccessTokenChangeWatch(watchState);

  if (isError || productCategories.length === 0) return <div>Failed to fetch product categories</div>;

  return (
    <Form.Group>
      <Form.Label>Product Categories</Form.Label>
      <MultiselectInput<IProductCategory>
        {...props}
        list={productCategories}
        idSelector={(productCategory) => Number(productCategory.id)}
        nameSelector={(productCategory) => productCategory.name}
        selectedValues={selectedProductCategories}
        onChange={(selectedList) => {
          setSelectedProductCategories(selectedList);
          onSelectionChange(selectedList);
        }}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}
