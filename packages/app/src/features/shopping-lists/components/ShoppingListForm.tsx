import "../styles/ShoppingListForm.scss";

import { FormProvider, useForm } from "react-hook-form";
import { ICreateShoppingListDto, IShoppingList } from "@biaplanner/shared";
import { useShoppingListItemsActions, useShoppingListItemsState } from "../reducers/ShoppingListItemsReducer";

import BrowseProductsOffcanvas from "./BrowseProductsOffcanvas";
import Button from "react-bootstrap/esm/Button";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { FaSave } from "react-icons/fa";
import Heading from "@/components/Heading";
import { MdCancel } from "react-icons/md";
import ProductItemCardList from "./ProductItemCardList";
import TextInput from "@/components/forms/TextInput";
import { useCallback } from "react";
import { useErrorToast } from "@/components/toasts/ErrorToast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type ShoppingListFormValues = ICreateShoppingListDto;

export type ShoppingListFormProps = {
  initialValue?: IShoppingList;
  onSubmit: (values: ShoppingListFormValues) => void;
  disableSubmit?: boolean;
  type: "create" | "update";
};

const ShoppingItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().int().positive("Quantity is required"),
});

const CreateShoppingListValidationSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  notes: z.string().optional(),
  plannedDate: z.string().min(1, "Planned date has to be in the correct format"),
  items: z.array(ShoppingItemSchema).optional(),
});

export default function ShoppingListForm({ initialValue, onSubmit, disableSubmit, type }: ShoppingListFormProps) {
  const { showOffcanvas } = useShoppingListItemsActions();
  const { selectedItems } = useShoppingListItemsState();
  const navigate = useNavigate();

  const formMethods = useForm<ShoppingListFormValues>({
    defaultValues: initialValue ?? {},
    mode: "onBlur",
    resolver: zodResolver(CreateShoppingListValidationSchema),
  });

  const {
    setValue,
    clearErrors,
    trigger,
    formState: { errors },
    getValues,
    handleSubmit,
  } = formMethods;

  const products = selectedItems.map((item) => item.product).filter(Boolean);

  const { notify: notifyError } = useErrorToast({});

  const onSubmitForm = useCallback(() => {
    const values = getValues();
    values.items = selectedItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    if (values.items.length === 0) {
      notifyError("You need to add at least one product to the shopping list to save it.");
      return;
    }
    onSubmit(values);
  }, [getValues, notifyError, onSubmit, selectedItems]);

  return (
    <FormProvider {...formMethods}>
      <BrowseProductsOffcanvas />
      <DualPaneForm onSubmit={handleSubmit(onSubmitForm)}>
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
            <div className="bp-shopping_list_form__shopping_list_details">
              <TextInput
                inputLabelProps={{ required: true }}
                label="Shopping list title"
                name="title"
                error={errors.title?.message}
                placeholder="Enter shopping list title"
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("title", value);
                  clearErrors("title");
                  trigger("title");
                }}
              />
              <TextInput
                label="Planned date"
                name="plannedDate"
                type="date"
                placeholder="Select a date"
                error={errors.plannedDate?.message}
                inputLabelProps={{ required: true }}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("plannedDate", value);
                  clearErrors("plannedDate");
                  trigger("plannedDate");
                }}
              />
              <TextInput
                label="Notes (optional)"
                className="bp-shopping_list_form__notes"
                name="notes"
                placeholder="Enter notes"
                error={errors.notes?.message}
                as="textarea"
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("notes", value);
                  clearErrors("notes");
                  trigger("notes");
                }}
              />
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
              <div>
                {errors.items && (
                  <div className="bp-shopping_list_form__error_message">
                    <p>{errors.items.message}</p>
                    <p className="bp-shopping_list_form__error_message__details">
                      {errors.items?.map?.((item) => (
                        <div>
                          <div>{item?.message}</div>
                          <div>{item?.productId?.message}</div>

                          <div>{item?.quantity?.message}</div>
                        </div>
                      ))}
                    </p>
                  </div>
                )}
              </div>
              {products.length === 0 ? (
                <div className="bp-shopping_list_form__no_items">
                  <Heading level={Heading.Level.H3}>No items added yet</Heading>
                  <p>Click on the button above to add products to your shopping list.</p>
                </div>
              ) : (
                <ProductItemCardList products={products} hideAddedBadge />
              )}
            </div>
          </DualPaneForm.Panel.Pane>
        </DualPaneForm.Panel>
      </DualPaneForm>
    </FormProvider>
  );
}
