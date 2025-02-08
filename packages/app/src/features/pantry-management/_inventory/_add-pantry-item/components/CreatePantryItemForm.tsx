import { FormProvider, useForm, useFormContext } from "react-hook-form";

import Button from "react-bootstrap/esm/Button";
import { CreatePantryItemDto } from "@biaplanner/shared";
import Form from "react-bootstrap/esm/Form";
import ProductsSingleSelect from "@/components/forms/ProductsSingleSelect";
import { useCallback } from "react";

export type CreatePantryItemFormData = CreatePantryItemDto;

export type CreatePantryItemFormProps = {
  initialValues?: CreatePantryItemFormData;
  onSubmit: (data: CreatePantryItemFormData) => void;
};

export default function CreatePantryItemForm(props: CreatePantryItemFormProps) {
  const { onSubmit } = props;
  const pantryItemForm = useForm<CreatePantryItemFormData>({
    defaultValues: props.initialValues,
    shouldFocusError: true,
    mode: "onBlur",
  });

  const onSubmitForm = useCallback(
    (_values) => {
      const values = pantryItemForm.getValues();

      console.log(values);
      onSubmit(values);
    },
    [onSubmit, pantryItemForm]
  );

  return (
    <FormProvider {...pantryItemForm}>
      <Form onSubmit={pantryItemForm.handleSubmit(onSubmitForm)}>
        <RequiredPantryItemDetailsSection />
      </Form>
    </FormProvider>
  );
}

function RequiredPantryItemDetailsSection() {
  const { setValue, register } = useFormContext();

  return (
    <section id="required-pantry-item-details-section">
      <h3>Required Pantry Item Details</h3>
      <ProductsSingleSelect
        onChange={(product) => {
          setValue("productId", product.id);
        }}
      />
      <Form.Group>
        <Form.Label htmlFor="quantity">Quantity</Form.Label>
        <Form.Control
          type="number"
          id="quantity"
          {...register("quantity", {
            valueAsNumber: true,
          })}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="expiryDate">Expiration Date</Form.Label>
        <Form.Control type="date" id="expiryDate" {...register("expiryDate")} />
      </Form.Group>

      <Button type="submit">Add Pantry Item</Button>
    </section>
  );
}
