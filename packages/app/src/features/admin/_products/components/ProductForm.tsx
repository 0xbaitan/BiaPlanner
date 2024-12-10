import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { IBrand, ICreateProductDto, IProductCategory, IUpdateProductDto } from "@biaplanner/shared";
import { useCallback, useEffect, useState } from "react";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import MultiselectInput from "@/components/forms/MultiselectInput";
import { Time } from "@biaplanner/shared/build/types/units/Time";
import TimeInput from "@/components/forms/TimeInput";
import VolumeInput from "@/components/forms/VolumeInput";
import WeightInput from "@/components/forms/WeightInput";
import { convertDurationStringToMilli } from "@biaplanner/shared/build/util";
import useAccessTokenChangeWatch from "@/hooks/useAccessTokenChangeWatch";
import { useLazyGetBrandsQuery } from "@/apis/BrandsApi";
import { useLazyGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type ProductFormValues = ICreateProductDto | IUpdateProductDto;
export type ProductFormProps = {
  initialValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void;
};

const ProductFormValidationSchema: z.ZodType<ProductFormValues> = z.object({
  name: z.string().min(1, "Product name is required"),
  // brandId: z.number().min(1, "Brand is required"),
  // canExpire: z.boolean(),
  // canQuicklyExpireAfterOpening: z.boolean().optional(),
  // millisecondsToExpiryAfterOpening: z.number().optional(),
  // productCategoryIds: z.array(z.number()).optional(),
  // expiryDate: z.string().datetime().optional(),
  // isLoose: z.boolean(),
  // numberOfServingsOrPieces: z.number().optional(),
  // useMeasurementMetric: z.union([z.literal("volume"), z.literal("weight")]).optional(),
  // volumePerContainerOrPacket: z.number().optional(),
  // volumeUnit: z.string().optional(),
  // weightPerContainerOrPacket: z.number().optional(),
  // weightUnit: z.string().optional(),
});

export default function ProductForm(props: ProductFormProps) {
  const { initialValues } = props;
  const formMethods = useForm<ProductFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(ProductFormValidationSchema),
  });

  const onSubmitForm = useCallback(
    (_values: ProductFormValues) => {
      const values = formMethods.getValues();
      console.log(values);
    },
    [formMethods]
  );

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={formMethods.handleSubmit(onSubmitForm)}>
        <RequiredDetails />
        <Button type="submit">Submit</Button>
      </Form>
    </FormProvider>
  );
}

function RequiredDetails() {
  const formMethods = useFormContext<ProductFormValues>();
  const {
    register,
    formState: { errors },
    setValue,
  } = formMethods;
  const [canExpire, setCanExpire] = useState<boolean>(false);
  const [canQuicklyExpireAfterOpening, setCanQuicklyExpireAfterOpening] = useState<boolean>(false);
  const [getProductCategories] = useLazyGetProductCategoriesQuery();
  const [isLoose, setIsLoose] = useState<boolean>(false);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [metric, setMetric] = useState<"volume" | "weight" | undefined>("volume");
  const [productCategories, setProductCategories] = useState<IProductCategory[]>([]);

  const [getBrands] = useLazyGetBrandsQuery();

  const onMetricChange = useCallback(
    (value: "volume" | "weight" | undefined) => {
      setMetric(value);
      setValue("useMeasurementMetric", value);
    },
    [setValue]
  );

  const onAuthChange = useCallback(async () => {
    const brands = await getBrands({}).unwrap();
    const productCategories = await getProductCategories({}).unwrap();
    setBrands(brands);
    setProductCategories(productCategories);
  }, [getBrands, getProductCategories]);

  useEffect(() => {
    setValue("brandId", brands[0]?.id);
  }, [brands, setValue]);

  useAccessTokenChangeWatch(onAuthChange);
  return (
    <>
      <Form.Group>
        <Form.Label>Product Name</Form.Label>
        <Form.Control {...formMethods.register("name")} isInvalid={!!errors.name} />
        {formMethods.formState.errors.name && <Form.Control.Feedback type="invalid">{errors?.name?.message}</Form.Control.Feedback>}
      </Form.Group>
      <Form.Group>
        <Form.Label>Brand</Form.Label>
        <Form.Select {...register("brandId")} isInvalid={!!errors.brandId}>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </Form.Select>
        {errors.brandId && <Form.Control.Feedback type="invalid">{errors?.brandId?.message}</Form.Control.Feedback>}
        <Form.Group>
          <Form.Label>Product Categories</Form.Label>
          <MultiselectInput<IProductCategory>
            list={productCategories}
            idSelector={(category) => Number(category.id)}
            nameSelector={(category) => category.name}
            onChange={(values) => {
              const productCategoryIds = values.map((value) => Number(value.id));
              setValue("productCategoryIds", productCategoryIds);
            }}
          />
        </Form.Group>
      </Form.Group>
      <Form.Group>
        <Form.Switch {...register("canExpire")} checked={canExpire} onChange={(e) => setCanExpire(e.target.checked)} label="Can this product have an expiry date?" />
        {canExpire && (
          <Form.Group>
            <Form.Switch {...register("canQuicklyExpireAfterOpening")} checked={canQuicklyExpireAfterOpening} onChange={(e) => setCanQuicklyExpireAfterOpening(e.target.checked)} label="Can this product expire at a quicker rate after opening?" />
            {canQuicklyExpireAfterOpening && (
              <Form.Group className="my-3">
                <Form.Label>How long will the product remain consumable after opening?</Form.Label>
                <TimeInput
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
              <Form.Control {...register("numberOfServingsOrPieces")} type="number" min={0} step={1} />
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
