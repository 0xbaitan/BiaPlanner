import { ICreateRecipeTagDto, IRecipeTag, IUpdateRecipeTagDto } from "@biaplanner/shared";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import TextInput from "@/components/forms/TextInput";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type RecipeTagFormValues = ICreateRecipeTagDto | ICreateRecipeTagDto;

export type RecipeTagFormProps = {
  type: "create" | "update";
  disableSubmit?: boolean;
  initialValue?: Partial<IRecipeTag>;
  onSubmit: (values: RecipeTagFormValues) => void;
};

export const CreateRecipeTagValidationSchema: z.ZodType<ICreateRecipeTagDto> = z.object({
  name: z.string().min(1, { message: "Recipe tag name is required" }),
});

export const UpdateRecipeTagValidationSchema: z.ZodType<IUpdateRecipeTagDto> = z.object({
  id: z.string().min(1, { message: "Recipe tag id is required" }),
  name: z.string().min(1, { message: "Recipe tag name is required" }),
});

export default function RecipeTagForm(props: RecipeTagFormProps) {
  const { initialValue, onSubmit, disableSubmit, type } = props;

  const methods = useForm<RecipeTagFormValues>({
    defaultValues: {
      ...initialValue,
      name: initialValue?.name ?? "",
    },
    mode: "onBlur",
    resolver: zodResolver(type === "create" ? CreateRecipeTagValidationSchema : UpdateRecipeTagValidationSchema),
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

  return (
    <Form onSubmit={handleSubmit(initiateSubmit)}>
      <TextInput
        label="Recipe tag name"
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
