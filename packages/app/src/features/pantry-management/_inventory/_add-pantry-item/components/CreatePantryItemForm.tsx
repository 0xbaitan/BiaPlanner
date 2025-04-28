import "../styles/CreatePantryItemForm.scss";

import { CreatePantryItemDto, WritePantryItemSchema } from "@biaplanner/shared";

import Button from "react-bootstrap/Button";
import { FaSave } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import { MdCancel } from "react-icons/md";
import ProductsSingleSelect from "@/components/forms/ProductsSingleSelect";
import { RoutePaths } from "@/Routes";
import SinglePaneForm from "@/components/forms/SinglePaneForm";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

export type CreatePantryItemFormProps = {
  initialValues?: CreatePantryItemDto;
  onSubmit: (data: CreatePantryItemDto) => void;
  disableSubmit?: boolean;
};

export default function CreatePantryItemForm(props: CreatePantryItemFormProps) {
  const { onSubmit, initialValues, disableSubmit } = props;
  const navigate = useNavigate();

  const methods = useForm<CreatePantryItemDto>({
    defaultValues: initialValues,
    shouldFocusError: true,
    mode: "onBlur",
    resolver: zodResolver(WritePantryItemSchema),
  });

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = methods;

  const onSubmitForm = useCallback(
    (values: CreatePantryItemDto) => {
      console.log(values);
      onSubmit(values);
    },
    [onSubmit]
  );

  return (
    <SinglePaneForm
      onSubmit={handleSubmit(onSubmitForm)}
      className="bp-pantry_item_form"
      breadcrumbs={[
        {
          label: "Pantry",
          href: RoutePaths.PANTRY,
        },
        {
          label: "Add Item",
          href: RoutePaths.PANTRY_ADD_ITEM,
        },
      ]}
      headerTitle="Add Pantry Item"
      headerActions={
        <>
          <Button type="button" variant="outline-secondary" onClick={() => navigate(RoutePaths.PANTRY)}>
            <MdCancel />
            <span className="ms-2">Cancel</span>
          </Button>
          <Button type="submit" variant="primary" disabled={disableSubmit}>
            <FaSave />
            <span className="ms-2">Add Item</span>
          </Button>
        </>
      }
      paneContent={
        <div className="bp-pantry_item_form__pane_content">
          <ProductsSingleSelect
            onChange={(product) => {
              setValue("productId", product.id);
            }}
            error={errors.productId?.message}
          />
          <Form.Group>
            <Form.Label htmlFor="quantity">Quantity</Form.Label>
            <Form.Control
              type="number"
              id="quantity"
              isInvalid={!!errors.quantity}
              {...register("quantity", {
                valueAsNumber: true,
              })}
            />
            {errors.quantity && <Form.Control.Feedback type="invalid">{errors.quantity.message}</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="expiryDate">Expiration Date</Form.Label>
            <Form.Control type="date" id="expiryDate" isInvalid={!!errors.expiryDate} {...register("expiryDate")} />
            {errors.expiryDate && <Form.Control.Feedback type="invalid">{errors.expiryDate.message}</Form.Control.Feedback>}
          </Form.Group>
        </div>
      }
    />
  );
}
