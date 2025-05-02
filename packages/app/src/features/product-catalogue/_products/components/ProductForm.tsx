import "../styles/ProductForm.scss";

import { IProduct, IWriteProductDto, Weights, WriteProductDtoSchema } from "@biaplanner/shared";
import { useCallback, useState } from "react";

import BrandSingleSelect from "@/components/forms/BrandSingleSelect";
import Button from "react-bootstrap/Button";
import CookingMeasurementInput from "./CookingMeasurementInput";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { FaSave } from "react-icons/fa";
import Form from "react-bootstrap/Form";
import ImageSelector from "@/components/forms/ImageSelector";
import { MdCancel } from "react-icons/md";
import ProductCategoryMultiselect from "@/components/forms/ProductCategoryMultiselect";
import { RoutePaths } from "@/Routes";
import TextInput from "@/components/forms/TextInput";
import serialiseIntoFormData from "@/util/serialiseIntoFormData";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useValidationErrorToast from "@/components/toasts/ValidationErrorToast";
import { zodResolver } from "@hookform/resolvers/zod";

export type ProductFormProps = {
  type: "create" | "update";
  disableSubmit?: boolean;
  initialValue?: IProduct;
  onSubmit: (values: FormData) => void;
};

export default function ProductForm(props: ProductFormProps) {
  const { initialValue, onSubmit, disableSubmit, type } = props;
  const [coverFile, setCoverFile] = useState<File>();
  const navigate = useNavigate();

  const methods = useForm<IWriteProductDto>({
    defaultValues: {
      name: initialValue?.name ?? undefined,
      description: initialValue?.description ?? "",
      brandId: initialValue?.brandId,
      productCategoryIds: initialValue?.productCategories?.map((category) => category.id) ?? [],
      canExpire: initialValue?.canExpire ?? false,

      isLoose: initialValue?.isLoose ?? false,
      measurement: initialValue?.measurement,
    },
    mode: "onBlur",
    resolver: zodResolver(WriteProductDtoSchema),
  });

  const { onSubmitError } = useValidationErrorToast();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const submitForm = useCallback(
    async (values: IWriteProductDto) => {
      const formData = serialiseIntoFormData({
        ...values,
        file: coverFile,
      });
      console.log("formData", formData);
      onSubmit(formData);
    },
    [coverFile, onSubmit]
  );

  return (
    <DualPaneForm onSubmit={handleSubmit(submitForm, onSubmitError)}>
      <DualPaneForm.Header>
        <DualPaneForm.Header.Title>{type === "create" ? "Create Product" : "Edit Product"}</DualPaneForm.Header.Title>
        <DualPaneForm.Header.Actions>
          <Button type="button" variant="outline-secondary" onClick={() => navigate(RoutePaths.PRODUCTS)}>
            <MdCancel />
            <span className="ms-2">Cancel</span>
          </Button>
          <Button type="submit" variant="primary" disabled={disableSubmit}>
            <FaSave />
            <span className="ms-2">Save Product</span>
          </Button>
        </DualPaneForm.Header.Actions>
      </DualPaneForm.Header>

      <DualPaneForm.Panel>
        <DualPaneForm.Panel.Pane>
          <ImageSelector value={coverFile} valueMetadata={initialValue?.cover} onChange={(file) => setCoverFile(file)} helpText="Upload a cover image for this product. Recommended image dimensions are 1200 x 800 px." />
          <TextInput label="Product Name" value={watch("name")} inputLabelProps={{ required: true }} error={errors.name?.message} onChange={(e) => setValue("name", e.target.value)} />
          <BrandSingleSelect error={errors.brandId?.message} initialValueId={initialValue?.brandId} onChange={(brand) => setValue("brandId", brand.id)} />
          <ProductCategoryMultiselect
            error={errors.productCategoryIds?.message}
            initialValues={initialValue?.productCategories ?? []}
            onSelectionChange={(categories) =>
              setValue(
                "productCategoryIds",
                categories.map((c) => c.id)
              )
            }
          />
        </DualPaneForm.Panel.Pane>

        <DualPaneForm.Panel.Pane>
          <Form.Group>
            <Form.Switch
              checked={watch("canExpire")}
              onChange={(e) => {
                setValue("canExpire", e.target.checked);
              }}
              label="Can this product have an expiry date?"
            />
          </Form.Group>

          <Form.Group>
            <Form.Switch
              checked={watch("isLoose")}
              onChange={(e) => {
                setValue("isLoose", e.target.checked);
                if (!e.target.checked) {
                  setValue("measurement", {
                    magnitude: 0,
                    unit: Weights.GRAM,
                  });
                }
              }}
              label="Is this product sold as a loose item?"
            />
            {!watch("isLoose") && <CookingMeasurementInput initialValue={initialValue?.measurement} onChange={(value) => setValue("measurement", value)} />}
          </Form.Group>
        </DualPaneForm.Panel.Pane>
      </DualPaneForm.Panel>
    </DualPaneForm>
  );
}
