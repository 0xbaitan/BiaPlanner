import "../styles/ProductCategoryMultiselect.scss";

import InputLabel, { InputLabelProps } from "./InputLabel";
import { useMemo, useState } from "react";

import FilterSelect from "./FilterSelect";
import Form from "react-bootstrap/Form";
import { IProductCategory } from "@biaplanner/shared";
import { SelectInputProps } from "./SelectInput";
import { useGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";

export type ProductCategoryMultiselectProps = Omit<SelectInputProps<IProductCategory>, "list" | "idSelector" | "nameSelector" | "selectedValues" | "onSelect"> & {
  initialValues?: Pick<IProductCategory, "id">[];
  onSelectionChange: (productCategories: IProductCategory[]) => void | Promise<void>;
  error?: string;
  label?: string;
  labelProps?: InputLabelProps;
};

export default function ProductCategoryMultiselect(props: ProductCategoryMultiselectProps) {
  const { initialValues, onSelectionChange, error, label, labelProps } = props;
  const { data: productCategories, isError } = useGetProductCategoriesQuery();

  const defaultValues = useMemo(() => {
    if (!productCategories) return [];
    return productCategories.filter((productCategory) => {
      if (!initialValues) return true;
      return initialValues.some((initialValue) => initialValue.id === productCategory.id);
    });
  }, [productCategories, initialValues]);

  const [selectedProductCategories, setSelectedProductCategories] = useState<IProductCategory[]>(defaultValues ?? []);

  if (isError || !productCategories || productCategories.length === 0) return <div>Failed to fetch product categories</div>;

  return (
    <Form.Group className="bp-product_category_multiselect">
      <InputLabel {...labelProps}>{label}</InputLabel>
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
