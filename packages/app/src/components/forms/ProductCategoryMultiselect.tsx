import MultiselectInput, { MultiselectInputProps } from "./MultiselectInput";

import Form from "react-bootstrap/Form";
import { IProductCategory } from "@biaplanner/shared";
import { useGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";
import { useState } from "react";

export type ProductCategoryMultiselectProps = Omit<MultiselectInputProps<IProductCategory>, "list" | "idSelector" | "nameSelector" | "selectedValues" | "onSelect"> & {
  initialValues?: IProductCategory[];
  onSelectionChange: (productCategories: IProductCategory[]) => void | Promise<void>;
  error?: string;
};

export default function ProductCategoryMultiselect(props: ProductCategoryMultiselectProps) {
  const { initialValues, onSelectionChange, error } = props;
  const { data: productCategories, isError } = useGetProductCategoriesQuery({});

  const [selectedProductCategories, setSelectedProductCategories] = useState<IProductCategory[]>(() => (initialValues ? [...initialValues] : []));

  if (isError || !productCategories || productCategories.length === 0) return <div>Failed to fetch product categories</div>;

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
