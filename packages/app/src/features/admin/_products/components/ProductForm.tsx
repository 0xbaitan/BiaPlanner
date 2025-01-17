import { Approximates, ICreateProductDto, IProduct, IUpdateProductDto } from "@biaplanner/shared";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useCallback, useState } from "react";

import BrandSingleSelect from "@/components/forms/BrandSingleSelect";
import Button from "react-bootstrap/esm/Button";
import CookingMeasurementInput from "./CookingMeasurementInput";
import Form from "react-bootstrap/esm/Form";
import MeasurementInput from "@/features/meal-planning/_recipes/components/MeasurementInput";
import ProductCategoryMultiselect from "@/components/forms/ProductCategoryMultiselect";
import { Time } from "@biaplanner/shared/build/types/units/Time";
import TimeInput from "@/components/forms/TimeInput";
import VolumeInput from "@/components/forms/VolumeInput";
import WeightInput from "@/components/forms/WeightInput";
import { convertDurationStringToMilli } from "@biaplanner/shared/build/util";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type FormAction = "create" | "update";

export type ProductFormValues = ICreateProductDto | IUpdateProductDto;

export type ProductFormProps = {
  type: FormAction;
  initialValues?: IProduct;
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
  const { initialValues, onSubmit, type, submitButtonText = "Add Product" } = props;
  const formMethods = useForm<IProduct>({
    defaultValues: initialValues,
    resolver: zodResolver(ProductFormValidationSchema),
  });

  const onSubmitForm = useCallback(() => {
    const values = formMethods.getValues();
    console.log(values);
    onSubmit(values);
  }, [formMethods, onSubmit]);

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

  return (
    <>
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
              setValue("measurements", []);
            }
          }}
        />
        {!isLoose && (
          <CookingMeasurementInput
            initialValue={
              initialValues?.measurements?.[0]
                ? {
                    magnitude: initialValues.measurements[0].magnitude,
                    unit: initialValues.measurements[0].unit,
                  }
                : undefined
            }
            onChange={(value) => {
              console.log("cooking measurement", value);
              setValue("measurements", [value]);
            }}
          />
        )}
      </Form.Group>
    </>
  );
}
