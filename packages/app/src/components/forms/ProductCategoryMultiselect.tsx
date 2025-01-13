import SelectInput, { SelectInputProps } from "./SelectInput";

import Form from "react-bootstrap/Form";
import { IProductCategory } from "@biaplanner/shared";
import { useGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";
import { useState } from "react";

export type ProductCategoryMultiselectProps = Omit<SelectInputProps<IProductCategory>, "list" | "idSelector" | "nameSelector" | "selectedValues" | "onSelect"> & {
  initialValues?: IProductCategory[];
  onSelectionChange: (productCategories: IProductCategory[]) => void | Promise<void>;
  error?: string;
  label?: string;
};

export default function ProductCategoryMultiselect(props: ProductCategoryMultiselectProps) {
  const { initialValues, onSelectionChange, error, label } = props;
  const { data: productCategories, isError } = useGetProductCategoriesQuery();

  const [selectedProductCategories, setSelectedProductCategories] = useState<IProductCategory[]>(() => (initialValues ? [...initialValues] : []));

  if (isError || !productCategories || productCategories.length === 0) return <div>Failed to fetch product categories</div>;

  return (
    <Form.Group>
      <Form.Label>{label ?? "Product Categories"}</Form.Label>
      <SelectInput<IProductCategory>
        {...props}
        multi
        list={productCategories}
        idSelector={(productCategory) => productCategory.id}
        nameSelector={(productCategory) => productCategory.name}
        selectedValues={selectedProductCategories}
        onChange={(selectedList: IProductCategory[]) => {
          setSelectedProductCategories(selectedList);
          onSelectionChange(selectedList);
        }}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}
