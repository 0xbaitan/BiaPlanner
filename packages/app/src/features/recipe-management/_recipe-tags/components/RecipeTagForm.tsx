import { IRecipeTag, IWriteRecipeTagDto, WriteRecipeTagDtoSchema } from "@biaplanner/shared";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import Button from "react-bootstrap/esm/Button";
import CancelButton from "@/components/buttons/CancelButton";
import SaveButton from "@/components/buttons/SaveButton";
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
  const { initialValue, onSubmit, type } = props;

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
          href: RoutePaths.RECIPE_TAGS,
        },
        {
          label: type === "create" ? "Create Recipe Tag" : "Edit Recipe Tag",
          href:
            type === "create"
              ? RoutePaths.RECIPE_TAGS_CREATE
              : fillParametersInPath(RoutePaths.RECIPE_TAGS_EDIT, {
                  id: initialValue?.id ?? "",
                }),
        },
      ]}
      headerTitle={type === "create" ? "Create Recipe Tag" : `Edit Recipe Tag`}
      headerActions={
        <>
          <CancelButton path={RoutePaths.RECIPE_TAGS} />
          <SaveButton label="Save Recipe Tag" />
        </>
      }
      paneContent={
        <div className="bp-form_pane_content">
          <TextInput
            label="Tag Name"
            defaultValue={initialValue?.name ?? ""}
            inputLabelProps={{
              required: true,
            }}
            value={getValues("name")}
            error={errors.name ? errors.name.message : undefined}
            onChange={(e) => {
              const value = e.target.value;
              setValue("name", value);
            }}
          />
          <TextInput
            label="Tag Description (optional)"
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
