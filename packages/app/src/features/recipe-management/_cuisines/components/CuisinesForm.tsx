import { ICreateCuisineDto, ICuisine, IUpdateCuisineDto } from "@biaplanner/shared";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import TextInput from "@/components/forms/TextInput";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type CuisinesFormValues = ICreateCuisineDto | IUpdateCuisineDto;

export type CuisinesFormProps = {
  type: "create" | "update";
  disableSubmit?: boolean;
  initialValue?: Partial<ICuisine>;
  onSubmit: (values: CuisinesFormValues) => void;
};

export const CreateCuisineValidationSchema = z.object({
  name: z.string().min(3).max(255),
});

export const UpdateCuisineValidationSchema = z.object({
  name: z.string().min(3).max(255),
});

export default function CuisinesForm(props: CuisinesFormProps) {
  const { initialValue, onSubmit, disableSubmit, type } = props;

  const methods = useForm<CuisinesFormValues>({
    defaultValues: {
      ...initialValue,
      name: initialValue?.name ?? "",
    },
    mode: "onBlur",
    resolver: zodResolver(type === "create" ? CreateCuisineValidationSchema : UpdateCuisineValidationSchema),
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
        label="Cuisine Name"
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
