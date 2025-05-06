import "../styles/ProductForm.scss";

import { Controller, FieldErrors, FormProvider, useForm, useFormContext } from "react-hook-form";
import { CookingMeasurementUnit, IBrand, ICookingMeasurement, IProduct, IWriteProductDto, Weights, WriteProductDtoSchema, getCookingMeasurementList, getMeasurementLabel } from "@biaplanner/shared";
import { FaInfoCircle, FaSave } from "react-icons/fa";
import { useCallback, useEffect, useMemo, useState } from "react";

import BrandSingleSelect from "@/components/forms/BrandSingleSelect";
import Button from "react-bootstrap/Button";
import CookingMeasurementInput from "./CookingMeasurementInput";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { ErrorMessage } from "@hookform/error-message";
import FilterSelect from "@/components/forms/FilterSelect";
import Form from "react-bootstrap/Form";
import ImageSelector from "@/components/forms/ImageSelector";
import ImprovedSelect from "@/components/forms/ImprovedSelect";
import InputLabel from "@/components/forms/InputLabel";
import { MdCancel } from "react-icons/md";
import ProductCategoryMultiselect from "@/components/forms/ProductCategoryMultiselect";
import { RoutePaths } from "@/Routes";
import Select from "react-dropdown-select";
import SinglePaneForm from "@/components/forms/SinglePaneForm";
import TextInput from "@/components/forms/TextInput";
import Tooltip from "@/components/Tooltip";
import serialiseIntoFormData from "@/util/serialiseIntoFormData";
import { useErrorToast } from "@/components/toasts/ErrorToast";
import { useGetBrandsQuery } from "@/apis/BrandsApi";
import { useGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";
import { useNavigate } from "react-router-dom";
import useToast from "@/hooks/useToast";
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
      name: initialValue?.name ?? "",
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

  const { handleSubmit, watch } = methods;

  const submitForm = useCallback(
    async (values: IWriteProductDto) => {
      console.log("values", values);
      const formData = serialiseIntoFormData({
        ...values,
        file: coverFile,
      });
      onSubmit(formData);
    },
    [coverFile, onSubmit]
  );

  const { notify } = useErrorToast();

  const handleValidationError = useCallback(
    (errors: FieldErrors<IWriteProductDto>) => {
      const firstErrorMessage = Object.values(errors)
        .map((error) => {
          if (error?.message) {
            return error.message;
          }
          return undefined;
        })
        .filter((error) => error !== undefined)[0];

      if (firstErrorMessage) {
        notify(firstErrorMessage);
      }
    },
    [notify]
  );

  return (
    <FormProvider {...methods}>
      <SinglePaneForm
        onSubmit={handleSubmit(submitForm, handleValidationError)}
        className="bp-product_form"
        breadcrumbs={[
          {
            label: "Products",
            href: RoutePaths.PRODUCTS,
          },
          {
            label: type === "create" ? "Create product" : "Edit product",
            href: undefined,
          },
        ]}
        headerTitle={type === "create" ? "Create product" : "Edit product"}
        headerActions={
          <>
            <Button type="button" variant="outline-secondary" onClick={() => navigate(RoutePaths.PRODUCTS)}>
              <MdCancel />
              <span className="ms-2">Cancel</span>
            </Button>
            <Button type="submit" variant="primary" disabled={disableSubmit}>
              <FaSave />
              <span className="ms-2">Save product</span>
            </Button>
          </>
        }
        paneContent={
          <div className="bp-product_form__pane_content">
            <div className="bp-product_form__image_selector">
              <ImageSelector value={coverFile} valueMetadata={initialValue?.cover} onChange={(file) => setCoverFile(file)} helpText="Upload a cover image for this product. Recommended image dimensions are 1200 x 800 px." />
            </div>
            <ProductNameInput />
            <BrandSelect />
            <ProductCategorySelect />

            <HasExpiryDateSwitch />
            <IsProductLooseSwitch />
            {!watch("isLoose") && <MeasurementInput />}
          </div>
        }
      />
    </FormProvider>
  );
}

function IsProductLooseSwitch() {
  const { control } = useFormContext<IWriteProductDto>();
  return (
    <Form.Group className="w-100">
      <Controller
        control={control}
        name="isLoose"
        render={({ field: { onChange, value } }) => {
          return (
            <Form.Switch
              className="w-100"
              label="Is this product sold loose, i.e., without packaging? (optional)"
              checked={value}
              onChange={(e) => {
                onChange(e.target.checked);
              }}
            />
          );
        }}
      />
    </Form.Group>
  );
}

function HasExpiryDateSwitch() {
  const { register } = useFormContext<IWriteProductDto>();

  return (
    <Form.Group className="w-100">
      <Form.Switch {...register("canExpire")} label="Does this product have an expiry date? (optional)" />
    </Form.Group>
  );
}

function ProductNameInput() {
  const { control } = useFormContext<IWriteProductDto>();

  return (
    <Controller control={control} name="name" render={({ field: { onChange, value }, fieldState: { error } }) => <TextInput label="Product Name" inputLabelProps={{ required: true }} value={value} onChange={onChange} error={error?.message} />} />
  );
}

function BrandSelect() {
  const { control } = useFormContext<IWriteProductDto>();
  const { data: brands, isLoading, isError } = useGetBrandsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching brands</div>;
  }

  return (
    <>
      <Controller
        control={control}
        name="brandId"
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const selectedBrand = brands?.find((brand) => brand.id === value);
          return (
            <Form.Group className="w-100">
              <InputLabel required className="justify-content-start">
                Product Brand
              </InputLabel>
              <FilterSelect
                maxSelectedValuesToShow={5}
                className="w-100"
                selectLabel="Select a brand"
                list={brands ?? []}
                idSelector={(brand) => brand.id}
                nameSelector={(brand) => brand.name}
                loading={isLoading}
                placeholder="Select a brand"
                selectedValues={selectedBrand ? [selectedBrand] : []}
                onChange={(values) => {
                  const selectedValue = values[0];
                  if (selectedValue) {
                    onChange(selectedValue.id);
                  }
                }}
                labelField="label"
                valueField="value"
                multi={false}
                error={error?.message}
              />
            </Form.Group>
          );
        }}
      />
    </>
  );
}

function ProductCategorySelect() {
  const { control } = useFormContext<IWriteProductDto>();
  const { data: categories, isLoading, isError } = useGetProductCategoriesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching categories</div>;
  }

  return (
    <Controller
      control={control}
      name="productCategoryIds"
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedCategories = categories?.filter((category) => value?.includes(category.id));
        return (
          <Form.Group className="w-100">
            <InputLabel required className="justify-content-start">
              Product Categories (max 5 only)
            </InputLabel>
            <FilterSelect
              maxSelectedValuesToShow={5}
              list={categories ?? []}
              selectLabel="Select product categories"
              idSelector={(category) => category.id}
              nameSelector={(category) => category.name}
              loading={isLoading}
              placeholder="Select product categories"
              selectedValues={selectedCategories ?? []}
              onChange={(values) => {
                const selectedValueIds = values.map((value) => value.id);
                onChange(selectedValueIds);
              }}
              labelField="label"
              valueField="value"
              multi
              error={error?.message}
            />
          </Form.Group>
        );
      }}
    />
  );
}

function MeasurementInput() {
  const { control } = useFormContext<IWriteProductDto>();

  return (
    <Controller
      control={control}
      name="measurement"
      render={({ field: { onChange, value } }) => {
        return (
          <Form.Group className="w-100">
            <InputLabel required className="justify-content-start">
              Product Measurements
            </InputLabel>
            <CookingMeasurementInput
              onChange={(measurement) => {
                console.log("measurement", measurement);
                onChange({
                  magnitude: measurement?.magnitude,
                  unit: measurement?.unit,
                });
              }}
              initialValue={{
                magnitude: value?.magnitude ?? 0,
                unit: value?.unit ?? Weights.GRAM,
              }}
            />
          </Form.Group>
        );
      }}
    />
  );
}
