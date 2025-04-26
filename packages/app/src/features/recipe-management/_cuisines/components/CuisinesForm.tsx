import { ICuisine, IWriteRecipeTagDto, WriteRecipeTagDtoSchema } from "@biaplanner/shared";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import Button from "react-bootstrap/esm/Button";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { RoutePaths } from "@/Routes";
import SinglePaneForm from "@/components/forms/SinglePaneForm";
import TextInput from "@/components/forms/TextInput";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type CuisinesFormProps = {
  type: "create" | "update";
  disableSubmit?: boolean;
  initialValue?: Partial<ICuisine>;
  onSubmit: (values: IWriteRecipeTagDto) => void;
};

export const CreateCuisineValidationSchema = z.object({
  name: z.string().min(3).max(255),
});

export const UpdateCuisineValidationSchema = z.object({
  name: z.string().min(3).max(255),
});

export default function CuisinesForm(props: CuisinesFormProps) {
  const { initialValue, onSubmit, disableSubmit, type } = props;
  const navigate = useNavigate();
  const methods = useForm<IWriteRecipeTagDto>({
    defaultValues: {
      name: initialValue?.name ?? undefined,
      description: initialValue?.description ?? undefined,
    },
    mode: "onBlur",
    resolver: zodResolver(WriteRecipeTagDtoSchema),
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
    <SinglePaneForm
      onSubmit={handleSubmit(initiateSubmit)}
      className="bp-cuisines_form"
      breadcrumbs={[
        {
          label: "Cuisines",
          href: RoutePaths.CUISINES,
        },
        {
          label: type === "create" ? "Create Cuisine" : "Edit Cuisine",
        },
      ]}
      headerTitle={type === "create" ? "Create Cuisine" : "Edit Cuisine"}
      headerActions={
        <>
          <Button type="button" variant="outline-secondary" onClick={() => navigate(RoutePaths.BRANDS)}>
            <MdCancel />
            <span className="ms-2">Cancel</span>
          </Button>
          <Button type="submit" variant="primary" disabled={disableSubmit}>
            <FaSave />
            <span className="ms-2">Save brand</span>
          </Button>
        </>
      }
      paneContent={
        <div className="bp-cuisines_form__pane_content p-3">
          <TextInput
            inputLabelProps={{
              required: true,
            }}
            value={getValues("name")}
            label="Cuisine Name"
            defaultValue={initialValue?.name}
            error={errors.name?.message}
            onChange={(e) => {
              const value = e.target.value;
              setValue("name", value);
            }}
          />
          <TextInput
            value={getValues("description") ?? undefined}
            label="Description (optional)"
            defaultValue={initialValue?.description}
            error={errors.description?.message}
            onChange={(e) => {
              const value = e.target.value;
              setValue("description", value);
            }}
          />
        </div>
      }
    />
  );
}
