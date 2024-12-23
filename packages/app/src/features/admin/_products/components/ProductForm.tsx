import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { ICreateProductDto, IUpdateProductDto } from "@biaplanner/shared";
import { useCallback, useState } from "react";

import BrandSingleSelect from "@/components/forms/BrandSingleSelect";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import ProductCategoryMultiselect from "@/components/forms/ProductCategoryMultiselect";
import { Time } from "@biaplanner/shared/build/types/units/Time";
import TimeInput from "@/components/forms/TimeInput";
import VolumeInput from "@/components/forms/VolumeInput";
import WeightInput from "@/components/forms/WeightInput";
import { convertDurationStringToMilli } from "@biaplanner/shared/build/util";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type ProductFormValues = ICreateProductDto | IUpdateProductDto;
export type ProductFormProps = {
  initialValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void;
  submitButtonText?: string;
};

const ProductFormValidationSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  // brandId: z.number().int().positive("Brand is required"),
  // productCategoryIds: z.array(z.number()).min(1, "At least one product category is required"),
  canExpire: z.boolean().optional(),
  canQuicklyExpireAfterOpening: z.boolean().optional(),
});

export default function ProductForm(props: ProductFormProps) {
  const { initialValues, onSubmit, submitButtonText = "Add Product" } = props;
  const formMethods = useForm<ProductFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(ProductFormValidationSchema),
  });

  const onSubmitForm = useCallback(
    (_values: ProductFormValues) => {
      const values = formMethods.getValues();
      console.log(values);
      onSubmit(values);
    },
    [formMethods, onSubmit]
  );

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={formMethods.handleSubmit(onSubmitForm)}>
        <RequiredDetails initialValues={initialValues} />
        <Button type="submit">{submitButtonText}</Button>
      </Form>
    </FormProvider>
  );
}

function RequiredDetails(props: Pick<ProductFormProps, "initialValues">) {
  console.log("initialValues", props.initialValues);
  const { initialValues } = props;
  const formMethods = useFormContext<ProductFormValues>();
  const {
    register,
    formState: { errors },
    setValue,
  } = formMethods;
  const [canExpire, setCanExpire] = useState<boolean>(false);
  const [canQuicklyExpireAfterOpening, setCanQuicklyExpireAfterOpening] = useState<boolean>(initialValues?.canQuicklyExpireAfterOpening ?? false);

  const [isLoose, setIsLoose] = useState<boolean>(initialValues?.isLoose ?? false);

  const [metric, setMetric] = useState<"volume" | "weight" | undefined>("volume");

  const onMetricChange = useCallback(
    (value: "volume" | "weight" | undefined) => {
      setMetric(value);
      setValue("useMeasurementMetric", value);
    },
    [setValue]
  );

  return (
    <>
      <Form.Group>
        <Form.Label>Product Name</Form.Label>
        <Form.Control {...formMethods.register("name")} isInvalid={!!errors.name} />
        {formMethods.formState.errors.name && <Form.Control.Feedback type="invalid">{errors?.name?.message}</Form.Control.Feedback>}
      </Form.Group>
      <BrandSingleSelect
        error={errors.brandId?.message}
        initialValue={initialValues?.brand}
        onChange={(brand) => {
          setValue("brandId", Number(brand.id));
        }}
      />

      <ProductCategoryMultiselect
        error={errors.productCategoryIds?.message}
        initialValues={initialValues?.productCategories}
        onSelectionChange={(productCategories) => {
          console.log("productCategories", productCategories);
          setValue(
            "productCategoryIds",
            productCategories.map((category) => Number(category.id))
          );
        }}
      />

      <Form.Group>
        <Form.Switch {...register("canExpire")} checked={canExpire} onChange={(e) => setCanExpire(e.target.checked)} label="Can this product have an expiry date?" />
        {canExpire && (
          <Form.Group>
            <Form.Switch {...register("canQuicklyExpireAfterOpening")} checked={canQuicklyExpireAfterOpening} onChange={(e) => setCanQuicklyExpireAfterOpening(e.target.checked)} label="Can this product expire at a quicker rate after opening?" />
            {canQuicklyExpireAfterOpening && (
              <Form.Group className="my-3">
                <Form.Label>How long will the product remain consumable after opening?</Form.Label>
                <TimeInput
                  defaultMagnitude={initialValues?.millisecondsToExpiryAfterOpening}
                  defaultUnit={Time.MILLISECOND}
                  magnitudeControlProps={{
                    min: 0,
                  }}
                  onChange={(magnitude, unit) => {
                    const millisecondsToExpiryAfterOpening = convertDurationStringToMilli(`${magnitude}${unit}`);
                    setValue("millisecondsToExpiryAfterOpening", millisecondsToExpiryAfterOpening);
                    console.log(millisecondsToExpiryAfterOpening);
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
              setValue("numberOfServingsOrPieces", undefined);
              setValue("useMeasurementMetric", undefined);
            }
          }}
        />
        {!isLoose && (
          <>
            <Form.Group>
              <Form.Label>Number of servings/pieces per package</Form.Label>
              <Form.Control
                {...register("numberOfServingsOrPieces", {
                  valueAsNumber: true,
                })}
                type="number"
                min={0}
                step={1}
                isInvalid={!!errors.numberOfServingsOrPieces}
              />
              {errors.numberOfServingsOrPieces && <Form.Control.Feedback type="invalid">{errors?.numberOfServingsOrPieces?.message}</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Choose the metric for measurement of the product</Form.Label>
              <Form.Check
                type="radio"
                checked={metric === "volume"}
                onChange={(e) => {
                  if (e.target.checked) onMetricChange("volume");
                }}
                label="Volume"
              />
              <Form.Check
                type="radio"
                checked={metric === "weight"}
                onChange={(e) => {
                  if (e.target.checked) onMetricChange("weight");
                }}
                label="Weight"
              />
              {metric === "volume" && (
                <Form.Group>
                  <Form.Label>Volume</Form.Label>
                  <VolumeInput
                    onChange={(magnitude, unit) => {
                      setValue("volumeUnit", unit);
                      setValue("volumePerContainerOrPacket", magnitude);
                      setValue("weightPerContainerOrPacket", undefined);
                      setValue("weightUnit", undefined);
                    }}
                  />
                </Form.Group>
              )}
              {metric === "weight" && (
                <Form.Group>
                  <Form.Label>Weight</Form.Label>
                  <WeightInput
                    onChange={(magnitude, unit) => {
                      setValue("weightUnit", unit);
                      setValue("weightPerContainerOrPacket", magnitude);
                      setValue("volumePerContainerOrPacket", undefined);
                      setValue("volumeUnit", undefined);
                    }}
                  />
                </Form.Group>
              )}
            </Form.Group>
          </>
        )}
      </Form.Group>
    </>
  );
}
