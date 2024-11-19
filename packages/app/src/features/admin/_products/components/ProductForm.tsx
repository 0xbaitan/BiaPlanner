import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { IBrand, ICreateProductDto, IUpdateProductDto } from "@biaplanner/shared";
import { useCallback, useEffect, useState } from "react";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { Time } from "@biaplanner/shared/build/types/units/Time";
import TimeInput from "@/components/forms/TimeInput";
import { convertDurationStringToMilli } from "@biaplanner/shared/build/util";
import useAccessTokenChangeWatch from "@/hooks/useAccessTokenChangeWatch";
import { useLazyGetBrandsQuery } from "@/apis/BrandsApi";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type ProductFormValues = ICreateProductDto | IUpdateProductDto;
export type ProductFormProps = {
  initialValues?: ProductFormValues;
  onSubmit: (values: ProductFormValues) => void;
};

const ProductFormValidationSchema: z.ZodType<ProductFormValues> = z.object({
  name: z.string().min(1, "Product name is required"),
  // brandId: z.number().min(1, "A brand must be selected"),
  //   canExpire: z.boolean(),
  //   canQuicklyExpireAfterOpening: z.boolean().optional(),
  //   millisecondsToExpiryAfterOpening: z.number().optional(),
  //   productCategoryIds: z.array(z.number()).optional(),
  //   expiryDate: z.string().datetime().optional(),
});

export default function ProductForm(props: ProductFormProps) {
  const { initialValues, onSubmit } = props;
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
      <h1>Add Product</h1>
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
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [getBrands] = useLazyGetBrandsQuery();
  const onAuthChange = useCallback(async () => {
    const brands = await getBrands({}).unwrap();
    setBrands(brands);
  }, [getBrands]);

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
        <Form.Select {...register("brandId")} defaultValue={undefined}>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </Form.Select>
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
                    units: [Time.SECOND, Time.MINUTE, Time.HOUR, Time.DAY, Time.WEEK, Time.MONTH],
                    type: "include",
                  }}
                  constraints={[
                    {
                      unit: Time.SECOND,
                      maxMagnitude: 60,
                    },
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
    </>
  );
}
