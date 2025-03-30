import { FormProvider, useForm } from "react-hook-form";
import { ICreateShoppingListDto, IShoppingList, IUpdateShoppingItemDto } from "@biaplanner/shared";

import BrowseProductsOffcanvas from "./BrowseProductsOffcanvas";
import Button from "react-bootstrap/esm/Button";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { FaSave } from "react-icons/fa";
import Heading from "@/components/Heading";
import { MdCancel } from "react-icons/md";
import TextInput from "@/components/forms/TextInput";
import { useNavigate } from "react-router-dom";
import { useShoppingListItemsActions } from "../reducers/ShoppingListItemsReducer";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type ShoppingListFormValues = ICreateShoppingListDto | IUpdateShoppingItemDto;

export type ShoppingListFormProps = {
  initialValue?: IShoppingList;
  onSubmit: (values: ShoppingListFormValues) => void;
  disableSubmit?: boolean;
  type: "create" | "update";
};

const CreateShoppingListValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  notes: z.string().optional(),
  plannedDate: z.string().optional(),
});

const UpdateShoppingListValidationSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().optional(),
  notes: z.string().optional(),
  plannedDate: z.string().optional(),
});

export default function ShoppingListForm(props: ShoppingListFormProps) {
  const { initialValue, onSubmit, disableSubmit, type } = props;
  const { showOffcanvas } = useShoppingListItemsActions();
  const navigate = useNavigate();
  const formMethods = useForm<ShoppingListFormValues>({
    defaultValues: initialValue ?? {},
    mode: "onBlur",
    resolver: type === "create" ? zodResolver(CreateShoppingListValidationSchema) : zodResolver(UpdateShoppingListValidationSchema),
  });

  return (
    <FormProvider {...formMethods}>
      <BrowseProductsOffcanvas />
      <DualPaneForm>
        <DualPaneForm.Header>
          <DualPaneForm.Header.Title>{type === "create" ? "Create a new shopping list" : "Update current shopping list"}</DualPaneForm.Header.Title>
          <DualPaneForm.Header.Actions>
            <Button type="button" variant="outline-secondary" onClick={() => navigate(-1)}>
              <MdCancel />
              <span className="ms-2">Cancel</span>
            </Button>
            <Button type="submit" disabled={disableSubmit}>
              <FaSave />
              <span className="ms-2">Save shopping list</span>
            </Button>
          </DualPaneForm.Header.Actions>
        </DualPaneForm.Header>
        <DualPaneForm.Panel>
          <DualPaneForm.Panel.Pane md={4} className="p-4">
            <Heading level={Heading.Level.H2}>Shopping List Details</Heading>
            <div className="mt-4">
              <TextInput inputLabelProps={{ required: true }} label="Shopping list title" name="title" placeholder="Enter shopping list title" />
              <TextInput label="Notes" name="notes" placeholder="Enter notes" as="textarea" formGroupClassName="mt-4" />
            </div>
          </DualPaneForm.Panel.Pane>

          <DualPaneForm.Panel.Pane className="p-4">
            <Heading level={Heading.Level.H2}>Shopping List Items</Heading>
            <Button variant="outline-secondary" className="mt-4">
              <span className="ms-2" onClick={showOffcanvas}>
                Add Shopping List Item
              </span>
            </Button>
            <div className="mt-4"></div>
          </DualPaneForm.Panel.Pane>
        </DualPaneForm.Panel>
      </DualPaneForm>
    </FormProvider>
  );
}
