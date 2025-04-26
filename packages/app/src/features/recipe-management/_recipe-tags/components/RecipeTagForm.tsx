import { IRecipeTag, IWriteRecipeTagDto, WriteRecipeTagDtoSchema } from "@biaplanner/shared";

import Button from "react-bootstrap/esm/Button";
import SinglePaneForm from "@/components/forms/SinglePaneForm";
import TextInput from "@/components/forms/TextInput";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type RecipeTagFormProps = {
  type: "create" | "update";
  disableSubmit?: boolean;
  initialValue?: Partial<IRecipeTag>;
  onSubmit: (values: IWriteRecipeTagDto) => void;
};

export default function RecipeTagForm(props: RecipeTagFormProps) {
  const { initialValue, onSubmit, disableSubmit, type } = props;

  const methods = useForm<IWriteRecipeTagDto>({
    defaultValues: {
      ...initialValue,
      name: initialValue?.name ?? "",
      description: initialValue?.description ?? "",
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

  const initiateSubmit = useCallback(
    async (values: IWriteRecipeTagDto) => {
      onSubmit(values);
    },
    [onSubmit]
  );

  return (
    <SinglePaneForm
      onSubmit={handleSubmit(initiateSubmit)}
      className="bp-recipe_tag_form"
      breadcrumbs={[
        {
          label: "Recipe Tags",
          href: "/recipe-tags",
        },
        {
          label: type === "create" ? "Create Recipe Tag" : "Edit Recipe Tag",
        },
      ]}
      headerTitle={type === "create" ? "Create Recipe Tag" : "Edit Recipe Tag"}
      headerActions={
        <Button type="submit" variant="primary" disabled={disableSubmit}>
          Submit
        </Button>
      }
      paneContent={
        <div className="bp-recipe_tag_form__pane_content">
          <TextInput
            label="Tag Name"
            defaultValue={initialValue?.name ?? ""}
            value={getValues("name")}
            error={errors.name ? errors.name.message : undefined}
            onChange={(e) => {
              const value = e.target.value;
              setValue("name", value);
            }}
          />
          <TextInput
            label="Tag Description"
            defaultValue={initialValue?.description ?? ""}
            value={getValues("description") ?? undefined}
            error={errors.description ? errors.description.message : undefined}
            onChange={(e) => {
              const value = e.target.value;
              setValue("description", value);
            }}
            as="textarea"
          />
        </div>
      }
    />
  );
}
