import { ICreateProductCategoryDto, IProductCategory, IUpdateProductCategoryDto } from "@biaplanner/shared";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import TextInput from "@/components/forms/TextInput";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type ProductCategoryFormValues = ICreateProductCategoryDto | IUpdateProductCategoryDto;

export type ProductCategoryFormProps = {
  type: "create" | "update";
  disableSubmit?: boolean;
  initialValue?: Partial<IProductCategory>;
  onSubmit: (values: ProductCategoryFormValues) => void;
};

export const CreateBrandValidationSchema: z.ZodType<ICreateProductCategoryDto> = z.object({
  name: z.string().min(1, { message: "Product category name is required" }),
});

export const UpdateBrandValidationSchema: z.ZodType<IUpdateProductCategoryDto> = z.object({
  id: z.string().min(1, { message: "Product category name is required" }),
  name: z.string().min(1, { message: "Product category name is required" }),
});

export default function BrandForm(props: ProductCategoryFormProps) {
  const { initialValue, onSubmit, disableSubmit, type } = props;

  const methods = useForm<ProductCategoryFormValues>({
    defaultValues: {
      ...initialValue,
      name: initialValue?.name ?? "",
    },
    mode: "onBlur",
    resolver: zodResolver(type === "create" ? CreateBrandValidationSchema : UpdateBrandValidationSchema),
  });

  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = methods;

  const initiateSubmit = useCallback(async () => {
    const values = getValues();

    onSubmit(values);
  }, [getValues, onSubmit]);
  console.log("errors", errors);
  return (
    <Form onSubmit={handleSubmit(initiateSubmit)}>
      <TextInput
        label="Product Category Name"
        defaultValue={initialValue?.name ?? ""}
        error={errors.name ? errors.name.message : undefined}
        onChange={(e) => {
          const value = e.target.value;
          setValue("name", value);
        }}
      />

      <Button type="submit" disabled={disableSubmit}>
        Submit
      </Button>
    </Form>
  );
}
