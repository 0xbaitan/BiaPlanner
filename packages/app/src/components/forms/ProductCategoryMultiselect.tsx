import "../styles/ProductCategoryMultiselect.scss";

import SelectInput, { SelectInputProps } from "./SelectInput";
import { useEffect, useState } from "react";

import FilterSelect from "./FilterSelect";
import Form from "react-bootstrap/Form";
import { IProductCategory } from "@biaplanner/shared";
import { useGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";

export type ProductCategoryMultiselectProps = Omit<SelectInputProps<IProductCategory>, "list" | "idSelector" | "nameSelector" | "selectedValues" | "onSelect"> & {
  initialValues?: Pick<IProductCategory, "id">[];
  onSelectionChange: (productCategories: IProductCategory[]) => void | Promise<void>;
  error?: string;
  label?: string;
};

export default function ProductCategoryMultiselect(props: ProductCategoryMultiselectProps) {
  const { initialValues, onSelectionChange, error, label } = props;
  const { data: productCategories, isError } = useGetProductCategoriesQuery();

  const [selectedProductCategories, setSelectedProductCategories] = useState<IProductCategory[]>([]);

  useEffect(() => {
    if (initialValues && productCategories) {
      const selectedCategories = initialValues.map((initialValue) => productCategories.find((category) => category.id === initialValue.id)).filter(Boolean);
      setSelectedProductCategories(selectedCategories as IProductCategory[]);
    }
  }, [initialValues, productCategories]);

  if (isError || !productCategories || productCategories.length === 0) return <div>Failed to fetch product categories</div>;

  return (
    <Form.Group className="bp-product_category_multiselect">
      <Form.Label>{label ?? "Product Categories"}</Form.Label>
      <FilterSelect<IProductCategory>
        {...props}
        error={error}
        multi
        placeholder="Select product categories..."
        list={productCategories}
        maxSelectedValuesToShow={3}
        idSelector={(productCategory) => productCategory.id}
        nameSelector={(productCategory) => productCategory.name}
        selectedValues={selectedProductCategories}
        onChange={(selectedList: IProductCategory[]) => {
          setSelectedProductCategories(selectedList);
          onSelectionChange(selectedList);
        }}
      />
    </Form.Group>
  );
}
