import "../styles/ProductForm.scss";

import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { ICreateProductDto, IProduct, IUpdateProductDto } from "@biaplanner/shared";
import { useCallback, useState } from "react";

import BrandSingleSelect from "@/components/forms/BrandSingleSelect";
import Button from "react-bootstrap/esm/Button";
import CookingMeasurementInput from "./CookingMeasurementInput";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { FaSave } from "react-icons/fa";
import Form from "react-bootstrap/esm/Form";
import Heading from "@/components/Heading";
import { ImageListType } from "react-images-uploading";
import ImageSelector from "@/components/forms/ImageSelector";
import { MdCancel } from "react-icons/md";
import ProductCategoryLazySelect from "@/components/forms/ProductCategoryLazySelect";
import ProductCategoryMultiselect from "@/components/forms/ProductCategoryMultiselect";
import { Time } from "@biaplanner/shared/build/types/units/Time";
import TimeInput from "@/components/forms/TimeInput";
import { useNavigate } from "react-router-dom";
import useUploadImageFile from "@/hooks/useUploadImageFile";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type FormAction = "create" | "update";

export type ProductFormValues = ICreateProductDto | IUpdateProductDto;

export type ProductFormProps = {
  type: FormAction;
  initialValues?: IProduct;
  onSubmit: (values: ProductFormValues) => void;

  disableSubmit?: boolean;
};

const ProductFormValidationSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  // brandId: z.number().int().positive("Brand is required"),
  // productCategoryIds: z.array(z.number()).min(1, "At least one product category is required"),
  canExpire: z.boolean().optional(),
  canQuicklyExpireAfterOpening: z.boolean().optional(),
});

export default function ProductForm(props: ProductFormProps) {
  const { initialValues, onSubmit, disableSubmit } = props;
  const formMethods = useForm<IProduct>({
    defaultValues: initialValues,
    resolver: zodResolver(ProductFormValidationSchema),
  });
  const uploadImage = useUploadImageFile();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const onSubmitForm = useCallback(async () => {
    const values = formMethods.getValues();
    if (coverImage) {
      const fileMetadata = await uploadImage(coverImage);
      values.coverId = fileMetadata.id;
    }
    console.log(values);
    onSubmit(values);
  }, [coverImage, formMethods, onSubmit, uploadImage]);

  return (
    <FormProvider {...formMethods}>
      <DualPaneForm onSubmit={formMethods.handleSubmit(onSubmitForm)}>
        <DualPaneForm.Header>
          <DualPaneForm.Header.Title>
            <Heading level={Heading.Level.H1}>Create a new product</Heading>
          </DualPaneForm.Header.Title>

          <DualPaneForm.Header.Actions>
            <Button type="button" variant="outline-secondary" onClick={() => navigate(-1)}>
              <MdCancel />
              <span className="ms-2">Cancel</span>
            </Button>
            <Button type="submit" disabled={disableSubmit}>
              <FaSave />
              <span className="ms-2">Save product</span>
            </Button>
          </DualPaneForm.Header.Actions>
        </DualPaneForm.Header>
      </DualPaneForm>
      <DualPaneForm.Panel>
        <DualPaneForm.Panel.Pane className="bp-product_form__pane">
          <Heading level={Heading.Level.H2}>General Details</Heading>
          <RequiredDetails initialValues={initialValues} setCoverImage={setCoverImage} />
        </DualPaneForm.Panel.Pane>
        <DualPaneForm.Panel.Pane className="bp-product_form__pane">
          <Heading level={Heading.Level.H2}>Product Configuration</Heading>
          <ProductConfiguration initialValues={initialValues} />
        </DualPaneForm.Panel.Pane>
      </DualPaneForm.Panel>
    </FormProvider>
  );
}
function ProductConfiguration(props: Pick<ProductFormProps, "initialValues">) {
  const { initialValues } = props;
  const [canExpire, setCanExpire] = useState<boolean>(false);
  const [canQuicklyExpireAfterOpening, setCanQuicklyExpireAfterOpening] = useState<boolean>(initialValues?.canQuicklyExpireAfterOpening ?? false);

  const [isLoose, setIsLoose] = useState<boolean>(initialValues?.isLoose ?? false);

  const formMethods = useFormContext<ProductFormValues>();
  const {
    register,

    setValue,
  } = formMethods;

  return (
    <>
      <Form.Group>
        <Form.Switch
          checked={canExpire}
          onChange={(e) => {
            setCanExpire(e.target.checked);
            setValue("canExpire", e.target.checked);
            if (!e.target.checked) {
              setValue("canQuicklyExpireAfterOpening", false);
              setValue("timeTillExpiryAfterOpening", undefined);
            }
          }}
          label="Can this product have an expiry date?"
        />
        {canExpire && (
          <Form.Group>
            <Form.Switch
              {...register("canQuicklyExpireAfterOpening")}
              checked={canQuicklyExpireAfterOpening}
              onChange={(e) => {
                setCanQuicklyExpireAfterOpening(e.target.checked);
                if (!e.target.checked) {
                  setValue("timeTillExpiryAfterOpening", undefined);
                }
              }}
              label="Can this product expire at a quicker rate after opening?"
            />
            {canQuicklyExpireAfterOpening && (
              <Form.Group className="my-3">
                <Form.Label>How long will the product remain consumable after opening?</Form.Label>
                <TimeInput
                  defaultMagnitude={initialValues?.timeTillExpiryAfterOpening?.magnitude}
                  defaultUnit={Time.MINUTE}
                  magnitudeControlProps={{
                    min: 0,
                  }}
                  onChange={(magnitude, unit) => {
                    setValue("timeTillExpiryAfterOpening", { magnitude, unit });
                  }}
                  filter={{
                    units: [Time.MINUTE, Time.HOUR, Time.DAY, Time.WEEK, Time.MONTH],
                    type: "include",
                  }}
                  constraints={[
                    {
                      unit: Time.MINUTE,
                      maxMagnitude: 60,
                    },
                    {
                      unit: Time.HOUR,
                      maxMagnitude: 24,
                    },
                    {
                      unit: Time.DAY,
                      maxMagnitude: 366,
                    },
                    {
                      unit: Time.WEEK,
                      maxMagnitude: 53,
                    },
                    {
                      unit: Time.MONTH,
                      maxMagnitude: 24,
                    },
                  ]}
                  strictOnConstraints
                />
              </Form.Group>
            )}
          </Form.Group>
        )}
      </Form.Group>
      <Form.Group>
        <Form.Switch
          {...register("isLoose")}
          label="Is this product sold as a loose item?"
          checked={isLoose}
          onChange={(e) => {
            setIsLoose(e.target.checked);
            if (!e.target.checked) {
              setValue("measurement", undefined);
            }
          }}
        />
        {!isLoose && (
          <CookingMeasurementInput
            initialValue={
              initialValues?.measurement
                ? {
                    magnitude: initialValues.measurement.magnitude,
                    unit: initialValues.measurement.unit,
                  }
                : undefined
            }
            onChange={(value) => {
              console.log("cooking measurement", value);
              setValue("measurement", value);
            }}
          />
        )}
      </Form.Group>
    </>
  );
}
function RequiredDetails(
  props: Pick<ProductFormProps, "initialValues"> & {
    setCoverImage: (image: File | null) => void;
  }
) {
  console.log("initialValues", props.initialValues);
  const { initialValues, setCoverImage } = props;
  const formMethods = useFormContext<ProductFormValues>();
  const {
    register,
    formState: { errors },
    setValue,
  } = formMethods;

  return (
    <>
      <ImageSelector
        className="bp-product_form__img_selector"
        helpText="Upload a cover image for this product. Recommended image dimensions are 1200 x 800 px."
        onChange={(file: File | undefined) => {
          setCoverImage(file ?? null);
        }}
      />
      <Form.Group>
        <Form.Label>Product Name</Form.Label>
        <Form.Control {...formMethods.register("name")} isInvalid={!!errors.name} />
        {formMethods.formState.errors.name && <Form.Control.Feedback type="invalid">{errors?.name?.message}</Form.Control.Feedback>}
      </Form.Group>
      <BrandSingleSelect
        error={errors.brandId?.message}
        initialValueId={initialValues?.brandId}
        onChange={(brand) => {
          setValue("brandId", brand.id);
        }}
      />

      {/* <ProductCategoryLazySelect /> */}

      <ProductCategoryMultiselect
        error={errors.productCategories?.message}
        initialValues={initialValues?.productCategories ?? []}
        onSelectionChange={(productCategories) => {
          console.log("productCategories", productCategories);
          setValue(
            "productCategories",
            productCategories.map((category) => {
              return { id: category.id };
            })
          );
        }}
      />
    </>
  );
}
