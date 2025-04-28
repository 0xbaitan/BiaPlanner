import { ICreateProductCategoryDto, IProductCategory, IWriteProductCategoryDto, WriteProductCategoryDtoSchema } from "@biaplanner/shared";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import CancelButton from "@/components/buttons/CancelButton";
import Form from "react-bootstrap/Form";
import SaveButton from "@/components/buttons/SaveButton";
import SinglePaneForm from "@/components/forms/SinglePaneForm";
import TextInput from "@/components/forms/TextInput";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type ProductCategoryFormProps = {
  type: "create" | "update";
  disableSubmit?: boolean;
  initialValue?: Partial<IProductCategory>;
  onSubmit: (values: IWriteProductCategoryDto) => void;
};

export default function ProductCategoryForm(props: ProductCategoryFormProps) {
  const { initialValue, onSubmit, disableSubmit, type } = props;

  const methods = useForm<IWriteProductCategoryDto>({
    defaultValues: {
      ...initialValue,
      name: initialValue?.name ?? "",
    },
    mode: "onBlur",
    resolver: zodResolver(WriteProductCategoryDtoSchema),
  });

  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = methods;

  const initiateSubmit = useCallback(
    async (values: IWriteProductCategoryDto) => {
      onSubmit(values);
    },
    [onSubmit]
  );

  return (
    <SinglePaneForm
      onSubmit={handleSubmit(initiateSubmit)}
      className="bp-product_category_form"
      breadcrumbs={[
        {
          label: "Product Categories",
          href: RoutePaths.PRODUCT_CATEGORIES,
        },
        {
          label: type === "create" ? "Create Product Category" : "Edit Product Category",
          href:
            type === "create"
              ? RoutePaths.PRODUCT_CATEGORIES_CREATE
              : fillParametersInPath(RoutePaths.PRODUCT_CATEGORIES_EDIT, {
                  id: initialValue?.id ?? "",
                }),
        },
      ]}
      headerTitle={type === "create" ? "Create Product Category" : "Edit Product Category"}
      headerActions={
        <>
          <CancelButton path={RoutePaths.PRODUCT_CATEGORIES} />
          <SaveButton label="Save Product Category" disabled={disableSubmit} />
        </>
      }
      paneContent={
        <div className="bp-form_pane_content">
          <TextInput
            label="Product Category Name"
            defaultValue={initialValue?.name ?? ""}
            inputLabelProps={{
              required: true,
            }}
            value={getValues("name")}
            error={errors.name ? errors.name.message : undefined}
            onChange={(e) => {
              const value = e.target.value;
              setValue("name", value);
            }}
          />
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Is Allergen? (optional)"
              defaultChecked={initialValue?.isAllergen ?? false}
              onChange={(e) => {
                const value = e.target.checked;
                setValue("isAllergen", value);
              }}
            />
            {errors.isAllergen && <span className="text-danger">{errors.isAllergen.message}</span>}
          </Form.Group>
        </div>
      }
    />
  );
}
