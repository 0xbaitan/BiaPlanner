import "../styles/BrandForm.scss";

import { IBrand, IWriteBrandDto, WriteBrandDtoSchema } from "@biaplanner/shared";
import { useCallback, useState } from "react";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import Button from "react-bootstrap/Button";
import { FaSave } from "react-icons/fa";
import ImageSelector from "@/components/forms/ImageSelector";
import { MdCancel } from "react-icons/md";
import { RoutePaths } from "@/Routes";
import SinglePaneForm from "@/components/forms/SinglePaneForm";
import TextInput from "@/components/forms/TextInput";
import serialiseIntoFormData from "@/util/serialiseIntoFormData";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

export type BrandFormProps = {
  type: "create" | "update";
  disableSubmit?: boolean;
  initialValue?: Partial<IBrand>;
  onSubmit: (values: FormData) => void;
};

export default function BrandForm(props: BrandFormProps) {
  const { initialValue, onSubmit, disableSubmit, type } = props;

  const [logoFile, setLogoFile] = useState<File>();

  const methods = useForm<IWriteBrandDto>({
    defaultValues: {
      name: initialValue?.name ?? "",
      description: initialValue?.description ?? "",
    },
    mode: "onBlur",
    resolver: zodResolver(WriteBrandDtoSchema),
  });

  const navigate = useNavigate();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const submitForm = useCallback(
    async (values: IWriteBrandDto) => {
      const formData = serialiseIntoFormData({
        ...values,
        file: logoFile,
      });
      onSubmit(formData);
    },
    [logoFile, onSubmit]
  );

  return (
    <SinglePaneForm
      onSubmit={handleSubmit(submitForm)}
      className="bp-brand_form"
      breadcrumbs={
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/brands">Brands</Breadcrumb.Item>
          <Breadcrumb.Item active>{type === "create" ? "Create Brand" : "Update Brand"}</Breadcrumb.Item>
        </Breadcrumb>
      }
      headerTitle={type === "create" ? "Create brand" : "Edit brand"}
      headerActions={
        <>
          <Button type="button" variant="outline-secondary" onClick={() => navigate(RoutePaths.BRANDS)}>
            <MdCancel />
            <span className="ms-2">Cancel</span>
          </Button>
          <Button type="submit" variant="primary" disabled={disableSubmit}>
            <FaSave />
            <span className="ms-2">Save recipe</span>
          </Button>
        </>
      }
      paneContent={
        <div className="bp-brand_form__pane_content">
          <TextInput
            inputLabelProps={{
              required: true,
            }}
            value={watch("name")}
            label="Brand Name"
            defaultValue={initialValue?.name ?? undefined}
            error={errors.name ? errors.name.message : undefined}
            onChange={(e) => {
              const value = e.target.value;
              setValue("name", value);
            }}
          />
          <TextInput
            label="Description (optional)"
            value={watch("description") ?? undefined}
            defaultValue={initialValue?.description ?? undefined}
            error={errors.description ? errors.description.message : undefined}
            onChange={(e) => {
              const value = e.target.value;
              setValue("description", value);
            }}
            as="textarea"
          />
          <div className="bp-brand_form__logo_selector">
            <ImageSelector
              value={logoFile}
              valueMetadata={initialValue?.logo}
              onChange={(file) => {
                setLogoFile(file);
              }}
              helpText="Upload a logo for this brand. Recommended image dimensions are 1200 x 800 px."
            />
          </div>
        </div>
      }
    />
  );
}
