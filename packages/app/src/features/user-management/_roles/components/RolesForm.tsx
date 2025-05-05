import { IRole, IWriteRoleDto, ViewOnlyRoleValue, WriteRoleDtoSchema } from "@biaplanner/shared";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import CancelButton from "@/components/buttons/CancelButton";
import SaveButton from "@/components/buttons/SaveButton";
import SinglePaneForm from "@/components/forms/SinglePaneForm";
import TextInput from "@/components/forms/TextInput";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useValidationErrorToast from "@/components/toasts/ValidationErrorToast";
import { zodResolver } from "@hookform/resolvers/zod";

export type RolesFormProps = {
  type: "create" | "update";
  disableSubmit?: boolean;
  initialValue?: Partial<IRole>;
  onSubmit: (values: IWriteRoleDto) => void;
};

export default function RolesForm(props: RolesFormProps) {
  const { initialValue, onSubmit, disableSubmit, type } = props;
  const navigate = useNavigate();
  const methods = useForm<IWriteRoleDto>({
    defaultValues: {
      name: initialValue?.name ?? undefined,
      description: initialValue?.description ?? undefined,
      permissions: initialValue?.permissions ?? ViewOnlyRoleValue,
    },
    mode: "onBlur",
    resolver: zodResolver(WriteRoleDtoSchema),
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

  const { onSubmitError } = useValidationErrorToast();

  return (
    <SinglePaneForm
      onSubmit={handleSubmit(initiateSubmit, onSubmitError)}
      className="bp-roles_form"
      breadcrumbs={[
        {
          label: "Roles",
          href: RoutePaths.ROLES,
        },
        {
          label: type === "create" ? "Create Role" : "Edit Role",
          href: type === "create" ? RoutePaths.ROLES_CREATE : fillParametersInPath(RoutePaths.ROLES_EDIT, { id: initialValue?.id ?? "" }),
        },
      ]}
      headerTitle={type === "create" ? "Create Role" : "Edit Role"}
      headerActions={
        <>
          <CancelButton path={RoutePaths.ROLES} />
          <SaveButton label="Save Role" type="submit" disabled={disableSubmit} className="ms-2" />
        </>
      }
      paneContent={
        <div className="bp-form_pane_content">
          <TextInput
            inputLabelProps={{
              required: true,
            }}
            value={getValues("name")}
            label="Role Name"
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
