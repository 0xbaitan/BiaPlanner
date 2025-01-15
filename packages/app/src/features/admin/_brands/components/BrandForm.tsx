import { DeepPartial, useForm } from "react-hook-form";
import { IBrand, ICreateBrandDto, IUpdateBrandDto } from "@biaplanner/shared";
import { useCallback, useState } from "react";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import ImageDropzone from "@/components/forms/ImageDropzone";
import TextInput from "@/components/forms/TextInput";
import useUploadImageFile from "@/hooks/useUploadImageFile";

export type BrandFormValues = ICreateBrandDto | IUpdateBrandDto;

export type BrandFormProps = {
  initialValue?: DeepPartial<IBrand>;
  onSubmit: (values: BrandFormValues) => void;
};

export default function BrandForm(props: BrandFormProps) {
  const { initialValue, onSubmit } = props;
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const uploadImage = useUploadImageFile();

  const methods = useForm<BrandFormValues>({
    defaultValues: initialValue,
    mode: "onBlur",
  });

  const { handleSubmit, getValues, setValue } = methods;

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
          onChange={(e) => {
            const value = e.target.value;
            setValue("name", value);
          }}
        />
        <TextInput
          label="Description"
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

        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
