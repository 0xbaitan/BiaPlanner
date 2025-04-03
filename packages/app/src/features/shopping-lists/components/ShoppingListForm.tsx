import "../styles/ShoppingListForm.scss";

import { FormProvider, useForm } from "react-hook-form";
import { ICreateShoppingListDto, IShoppingList, IUpdateShoppingItemDto } from "@biaplanner/shared";
import { useShoppingListItemsActions, useShoppingListItemsState } from "../reducers/ShoppingListItemsReducer";

import BrowseProductsOffcanvas from "./BrowseProductsOffcanvas";
import Button from "react-bootstrap/esm/Button";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { FaSave } from "react-icons/fa";
import Heading from "@/components/Heading";
import { MdCancel } from "react-icons/md";
import ProductItemCardList from "./ProductItemCardList";
import TextInput from "@/components/forms/TextInput";
import { useNavigate } from "react-router-dom";
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
  const { selectedItems } = useShoppingListItemsState();
  const navigate = useNavigate();
  const formMethods = useForm<ShoppingListFormValues>({
    defaultValues: initialValue ?? {},
    mode: "onBlur",
    resolver: type === "create" ? zodResolver(CreateShoppingListValidationSchema) : zodResolver(UpdateShoppingListValidationSchema),
  });
  const products = selectedItems.map((item) => item.product).filter((product) => product !== undefined);

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
            <Heading level={Heading.Level.H2} className="bp-shopping_list_form__shopping_list_details__header">
              Shopping List Details
            </Heading>
            <div className="mt-4">
              <TextInput inputLabelProps={{ required: true }} label="Shopping list title" name="title" placeholder="Enter shopping list title" />
              <TextInput label="Notes (optional)" className="bp-shopping_list_form__notes" name="notes" placeholder="Enter notes" as="textarea" formGroupClassName="mt-4" />
            </div>
          </DualPaneForm.Panel.Pane>

          <DualPaneForm.Panel.Pane className="p-4">
            <div className="bp-shopping_list_form__selected_items__header">
              <Heading level={Heading.Level.H2}>Selected Items</Heading>
              <Button variant="outline-secondary" className="mt-4" onClick={showOffcanvas}>
                Add products
              </Button>
            </div>
            <div className="mt-4">
              {products.length === 0 ? (
                <div className="bp-shopping_list_form__no_items">
                  <Heading level={Heading.Level.H3}>No items added yet</Heading>
                  <p>Click on the button above to add products to your shopping list.</p>
                </div>
              ) : (
                <ProductItemCardList products={products} hideAddedBadge={true} />
              )}
            </div>
          </DualPaneForm.Panel.Pane>
        </DualPaneForm.Panel>
      </DualPaneForm>
    </FormProvider>
  );
}
