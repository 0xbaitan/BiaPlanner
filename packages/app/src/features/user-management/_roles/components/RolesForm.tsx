import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { IBrandPermission, IMealPlanPermission, IPantryPermission, IPermission, IRole, IShoppingListPermission, IWriteRoleDto, ViewOnlyRoleValue, WriteRoleDtoSchema } from "@biaplanner/shared";
import { RoutePaths, fillParametersInPath } from "@/Routes";

import CancelButton from "@/components/buttons/CancelButton";
import Form from "react-bootstrap/Form";
import SaveButton from "@/components/buttons/SaveButton";
import SinglePaneForm from "@/components/forms/SinglePaneForm";
import TextInput from "@/components/forms/TextInput";
import { useCallback } from "react";
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
    <FormProvider {...methods}>
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
            <RoleNameInput />
            <RoleDescriptionInput />
            <AllPermissions />
          </div>
        }
      />
    </FormProvider>
  );
}

function RoleNameInput() {
  const { control } = useFormContext<IWriteRoleDto>();

  return (
    <Controller name="name" control={control} render={({ field, fieldState }) => <TextInput {...field} label="Role Name" inputLabelProps={{ required: true }} placeholder="Enter role name" className="mb-3" error={fieldState.error?.message} />} />
  );
}

function RoleDescriptionInput() {
  const { control } = useFormContext<IWriteRoleDto>();

  return (
    <Controller
      name="description"
      control={control}
      render={({ field, fieldState }) => <TextInput {...field} value={field.value ?? ""} label="Role Description (optional)" placeholder="Enter role description" className="mb-3" error={fieldState.error?.message} />}
    />
  );
}

type PermissionArea = keyof IWriteRoleDto["permissions"];
type ExhaustivePermissionKey = keyof IPermission | keyof IShoppingListPermission | keyof IPantryPermission | keyof IMealPlanPermission;
function getPermissionLabel(permissionKey: ExhaustivePermissionKey) {
  switch (permissionKey) {
    case "createItem":
      return "create";
    case "editItem":
      return "edit";

    case "deleteItem":
      return "delete";
    case "viewItem":
      return "view";
    case "viewList":
      return "view list";
    case "markShoppingAsDone":
      return "mark shopping as done";
    case "markCookingAsDone":
      return "mark cooking as done";
    case "consumeItem":
      return "consume";
    case "discardItem":
      return "discard";
    default:
      return "";
  }
}

function getPermissionAreaLabel(permissionArea: PermissionArea) {
  switch (permissionArea) {
    case "shoppingList":
      return "shopping lists";
    case "pantry":
      return "pantry";
    case "mealPlan":
      return "meal plans";
    case "brand":
      return "brands";

    case "cuisine":
      return "cuisines";
    case "recipe":
      return "recipes";
    case "product":
      return "products";
    case "productCategory":
      return "product categories";
    case "recipeTag":
      return "recipe tags";

    default:
      return "";
  }
}

function getSwitchLabel(permissionArea: PermissionArea, permissionKey: ExhaustivePermissionKey) {
  const permissionLabel = getPermissionLabel(permissionKey);
  const areaLabel = getPermissionAreaLabel(permissionArea);
  return `Enable ${permissionLabel} functionality for ${areaLabel}?`;
}

export type PermissionSwitchProps = {
  permissionArea: PermissionArea;
  permissionKey: keyof IPermission;
};

function PermissionSwitch(props: PermissionSwitchProps) {
  const { permissionArea, permissionKey } = props;
  const { register } = useFormContext<IWriteRoleDto>();
  const label = getSwitchLabel(permissionArea, permissionKey);
  return <Form.Switch {...register(`permissions.${permissionArea}.${permissionKey}`)} id={`${permissionArea}-${permissionKey}`} label={label} />;
}

function BasicPermissionSwitchGroup({ permissionArea }: { permissionArea: PermissionArea }) {
  return (
    <>
      <PermissionSwitch permissionArea={permissionArea} permissionKey="viewList" />
      <PermissionSwitch permissionArea={permissionArea} permissionKey="viewItem" />
      <PermissionSwitch permissionArea={permissionArea} permissionKey="createItem" />
      <PermissionSwitch permissionArea={permissionArea} permissionKey="editItem" />
      <PermissionSwitch permissionArea={permissionArea} permissionKey="deleteItem" />
    </>
  );
}

type ExtendedPermissionSwitchGroupProps = {
  permissionArea: PermissionArea;
};

function ExtendedPermissionSwitchGroup(props: ExtendedPermissionSwitchGroupProps) {
  const { permissionArea } = props;
  const { register } = useFormContext<IWriteRoleDto>();

  switch (permissionArea) {
    case "shoppingList":
      return (
        <>
          <BasicPermissionSwitchGroup permissionArea={permissionArea} />
          <Form.Switch {...register(`permissions.${permissionArea}.markShoppingAsDone`)} id={`${permissionArea}-markShoppingAsDone`} label="Enable mark shopping as done functionality?" />
        </>
      );

    case "pantry":
      return (
        <>
          <BasicPermissionSwitchGroup permissionArea={permissionArea} />
          <Form.Switch {...register(`permissions.${permissionArea}.consumeItem`)} id={`${permissionArea}-consumeItem`} label="Enable consume functionality?" />
          <Form.Switch {...register(`permissions.${permissionArea}.discardItem`)} id={`${permissionArea}-discardItem`} label="Enable discard functionality?" />
        </>
      );

    case "mealPlan":
      return (
        <>
          <BasicPermissionSwitchGroup permissionArea={permissionArea} />
          <Form.Switch {...register(`permissions.${permissionArea}.markCookingAsDone`)} id={`${permissionArea}-markCookingAsDone`} label="Enable mark cooking as done functionality?" />
        </>
      );

    default:
      return <BasicPermissionSwitchGroup permissionArea={permissionArea} />;
  }
}

type SwitchGroupWithLabelProps = {
  label: string;
  permissionArea: PermissionArea;
};

function SwitchGroupWithLabel(props: SwitchGroupWithLabelProps) {
  const { label, permissionArea } = props;

  return (
    <div className="mb-3">
      <Form.Label>{label}</Form.Label>
      <ExtendedPermissionSwitchGroup permissionArea={permissionArea} />
    </div>
  );
}

function AllPermissions() {
  return (
    <div className="mb-3">
      <Form.Label>Permissions</Form.Label>
      <SwitchGroupWithLabel label="Shopping List" permissionArea="shoppingList" />
      <SwitchGroupWithLabel label="Pantry" permissionArea="pantry" />
      <SwitchGroupWithLabel label="Meal Plan" permissionArea="mealPlan" />
      <SwitchGroupWithLabel label="Brands" permissionArea="brand" />
      <SwitchGroupWithLabel label="Cuisines" permissionArea="cuisine" />
      <SwitchGroupWithLabel label="Recipes" permissionArea="recipe" />
      <SwitchGroupWithLabel label="Products" permissionArea="product" />
      <SwitchGroupWithLabel label="Product Categories" permissionArea="productCategory" />
      <SwitchGroupWithLabel label="Recipe Tags" permissionArea="recipeTag" />
    </div>
  );
}
