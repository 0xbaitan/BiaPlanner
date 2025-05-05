import "../styles/ProductForm.scss";

import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { CookingMeasurementUnit, IBrand, ICookingMeasurement, IProduct, IWriteProductDto, Weights, WriteProductDtoSchema, getCookingMeasurementList, getMeasurementLabel } from "@biaplanner/shared";
import { useCallback, useEffect, useMemo, useState } from "react";

import BrandSingleSelect from "@/components/forms/BrandSingleSelect";
import Button from "react-bootstrap/Button";
import CookingMeasurementInput from "./CookingMeasurementInput";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { ErrorMessage } from "@hookform/error-message";
import { FaSave } from "react-icons/fa";
import FilterSelect from "@/components/forms/FilterSelect";
import Form from "react-bootstrap/Form";
import ImageSelector from "@/components/forms/ImageSelector";
import ImprovedSelect from "@/components/forms/ImprovedSelect";
import { MdCancel } from "react-icons/md";
import ProductCategoryMultiselect from "@/components/forms/ProductCategoryMultiselect";
import { RoutePaths } from "@/Routes";
import Select from "react-dropdown-select";
import TextInput from "@/components/forms/TextInput";
import serialiseIntoFormData from "@/util/serialiseIntoFormData";
import { useGetBrandsQuery } from "@/apis/BrandsApi";
import { useGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";
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
    <FormProvider {...methods}>
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
            <ProductNameInput />
            <BrandSelect />

            <ProductCategorySelect />

            {!watch("isLoose") && <MeasurementInput />}

            <IsProductLooseSwitch />
            <HasExpiryDateSwitch />
          </DualPaneForm.Panel.Pane>
        </DualPaneForm.Panel>
      </DualPaneForm>
    </FormProvider>
  );
}

function IsProductLooseSwitch() {
  const { control, setValue } = useFormContext<IWriteProductDto>();
  return (
    <Form.Group>
      <Controller
        control={control}
        name="isLoose"
        render={({ field: { onChange, value } }) => {
          return (
            <Form.Switch
              label="Is this product sold loose?"
              checked={value}
              onChange={(e) => {
                onChange(e.target.checked);
                setValue("measurement", null);
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
    <Form.Group>
      <Form.Switch {...register("canExpire")} label="Does this product have an expiry date?" />
    </Form.Group>
  );
}

function ProductNameInput() {
  const { control } = useFormContext<IWriteProductDto>();

  return <Controller control={control} name="name" render={({ field: { onChange, value }, fieldState: { error } }) => <TextInput label="Product Name" value={value} onChange={onChange} error={error?.message} />} />;
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
    <Controller
      control={control}
      name="brandId"
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedBrand = brands?.find((brand) => brand.id === value);
        return (
          <FilterSelect
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
        );
      }}
    />
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
          <FilterSelect
            list={categories ?? []}
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
          <CookingMeasurementInput
            onChange={(measurement) => {
              console.log("measurement", measurement);
              onChange({
                magnitude: measurement.magnitude,
                unit: measurement.unit,
              });
            }}
            initialValue={{
              magnitude: value?.magnitude ?? 0,
              unit: value?.unit ?? Weights.GRAM,
            }}
          />
        );
      }}
    />
  );
}
