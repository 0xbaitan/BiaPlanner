import { DeepPartial, useForm } from "react-hook-form";
import { IBrand, ICreateBrandDto, IUpdateBrandDto } from "@biaplanner/shared";
import { useCallback, useState } from "react";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import ImageDropzone from "@/components/forms/ImageDropzone";
import TextInput from "@/components/forms/TextInput";
import useUploadImageFile from "@/hooks/useUploadImageFile";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type BrandFormValues = ICreateBrandDto | IUpdateBrandDto;

export type BrandFormProps = {
  type: "create" | "update";
  disableSubmit?: boolean;
  initialValue?: DeepPartial<IBrand>;
  onSubmit: (values: BrandFormValues) => void;
};

export const CreateBrandValidationSchema: z.ZodType<ICreateBrandDto> = z.object({
  name: z.string().min(1, { message: "Brand name is required" }),
  description: z.string().optional(),
  logoId: z.string().optional(),
});

export const UpdateBrandValidationSchema: z.ZodType<IUpdateBrandDto> = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  logoId: z.string().optional(),
});

export default function BrandForm(props: BrandFormProps) {
  const { initialValue, onSubmit, disableSubmit, type } = props;
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const uploadImage = useUploadImageFile();

  const methods = useForm<BrandFormValues>({
    defaultValues: initialValue,
    mode: "onBlur",
    resolver: zodResolver(type === "create" ? CreateBrandValidationSchema : UpdateBrandValidationSchema),
  });

  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = methods;

  const initiateSubmit = useCallback(async () => {
    const values = getValues();
    if (logoFile) {
      const fileMetadata = await uploadImage(logoFile);
      values.logoId = fileMetadata.id;
    }
    onSubmit(values);
  }, [getValues, logoFile, onSubmit, uploadImage]);

  return (
    <div>
      <h1>Brands Form</h1>
      <Form onSubmit={handleSubmit(initiateSubmit)}>
        <TextInput
          label="Brand Name"
          error={errors.name ? errors.name.message : undefined}
          onChange={(e) => {
            const value = e.target.value;
            setValue("name", value);
          }}
        />
        <TextInput
          label="Description"
          error={errors.description ? errors.description.message : undefined}
          onChange={(e) => {
            const value = e.target.value;
            setValue("description", value);
          }}
          as="textarea"
        />
        <ImageDropzone
          onChange={([logo]) => {
            setLogoFile(logo);
          }}
        />

        <Button type="submit" disabled={disableSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}
