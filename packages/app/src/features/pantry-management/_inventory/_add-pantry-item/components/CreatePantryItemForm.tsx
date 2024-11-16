import { CreatePantryItemDto, IPantryItem, IProduct, UpdatePantryItemDto } from "@biaplanner/shared";
import { FormProvider, useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { useCallback, useState } from "react";
import { useGetProductsQuery, useLazyGetProductsQuery } from "@/apis/ProductsApi";

import Form from "react-bootstrap/esm/Form";
import useAccessTokenChangeWatch from "@/hooks/useAccessTokenChangeWatch";
import { useLazyGetPantryItemsQuery } from "@/apis/PantryItemsApi";

export type CreatePantryItemFormData = CreatePantryItemDto;

export type CreatePantryItemFormProps = {
  initialValues?: CreatePantryItemFormData;
  onSubmit: (data: CreatePantryItemFormData) => void;
};

export default function CreatePantryItemForm(props: CreatePantryItemFormProps) {
  const pantryItemForm = useForm<CreatePantryItemFormData>({
    defaultValues: props.initialValues,
    shouldFocusError: true,
    mode: "onBlur",
  });
  return (
    <FormProvider {...pantryItemForm}>
      <RequiredPantryItemDetailsSection />
    </FormProvider>
  );
}

function RequiredPantryItemDetailsSection() {
  const [getProducts] = useLazyGetProductsQuery();
  const [products, setProducts] = useState<IProduct[]>([]);

  const gettersAndSetters = useCallback(async () => {
    const { data: fetchedProducts } = await getProducts({});
    setProducts(fetchedProducts ?? []);
  }, [getProducts, setProducts]);

  useAccessTokenChangeWatch(gettersAndSetters);

  return (
    <section id="required-pantry-item-details-section">
      <h3>Required Pantry Item Details</h3>
      <Form.Group>
        <Form.Label>Select Product</Form.Label>
        <Form.Select>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </section>
  );
}
