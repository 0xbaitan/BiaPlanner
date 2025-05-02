import "../styles/ShoppingListForm.scss";

import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import { ICreateShoppingListDto, IShoppingList, IWriteShoppingListDto, WriteShoppingListItemSchema, WriteShoppingListSchema } from "@biaplanner/shared";
import { useCallback, useEffect } from "react";
import { useShoppingListItemsActions, useShoppingListItemsState } from "../reducers/ShoppingListItemsReducer";

import BrowseProductsOffcanvas from "./BrowseProductsOffcanvas";
import Button from "react-bootstrap/esm/Button";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { FaSave } from "react-icons/fa";
import Heading from "@/components/Heading";
import { MdCancel } from "react-icons/md";
import ProductCardList from "./ProductCardList";
import ShoppingListItemCardList from "./ShoppingListItemCardList";
import TextInput from "@/components/forms/TextInput";
import dayjs from "dayjs";
import { useErrorToast } from "@/components/toasts/ErrorToast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type ShoppingListFormProps = {
  initialValue?: IShoppingList;
  onSubmit: (values: IWriteShoppingListDto) => void;
  disableSubmit?: boolean;
  type: "create" | "update";
};

export default function ShoppingListForm({ initialValue, onSubmit, disableSubmit, type }: ShoppingListFormProps) {
  const { showOffcanvas } = useShoppingListItemsActions();
  useShoppingListItemsState();
  const navigate = useNavigate();

  const formMethods = useForm<IWriteShoppingListDto>({
    defaultValues: initialValue ?? {
      title: "",
      plannedDate: dayjs().format("YYYY-MM-DD"),
      notes: "",
      items: [],
    },

    mode: "onBlur",
    resolver: zodResolver(WriteShoppingListSchema),
  });

  const {
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const { notify: notifyError } = useErrorToast({});

  const items = watch();

  useEffect(() => {
    console.log("items", items);
  }, [items]);
  const onSubmitForm = useCallback(
    (values: IWriteShoppingListDto) => {
      onSubmit(values);
    },
    [onSubmit]
  );

  const onSubmitError = useCallback(
    (errors: FieldErrors<IWriteShoppingListDto>) => {
      const errorMessages = Object.values(errors).map((error) => {
        return error.message;
      });

      if (errorMessages.length > 0) {
        notifyError(
          <p>
            You have the following errors in the form:
            <ul>
              {errorMessages.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            Please correct them and try again.
          </p>
        );
      }
    },
    [notifyError]
  );

  return (
    <FormProvider {...formMethods}>
      <DualPaneForm onSubmit={handleSubmit(onSubmitForm, onSubmitError)}>
        <DualPaneForm.Header>
          <DualPaneForm.Header.Title>{type === "create" ? "Create a new shopping list" : "Edit current shopping list"}</DualPaneForm.Header.Title>
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
                value={watch("title")}
                name="title"
                error={errors.title?.message}
                placeholder="Enter shopping list title"
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("title", value);
                }}
              />
              <TextInput
                label="Planned date"
                name="plannedDate"
                type="date"
                value={watch("plannedDate")}
                placeholder="Select a date"
                error={errors.plannedDate?.message}
                inputLabelProps={{ required: true }}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("plannedDate", value);
                }}
              />
              <TextInput
                label="Notes (optional)"
                className="bp-shopping_list_form__notes"
                name="notes"
                value={watch("notes") ?? undefined}
                placeholder="Enter notes"
                error={errors.notes?.message}
                as="textarea"
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("notes", value);
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
              <ShoppingListItemCardList />
            </div>
          </DualPaneForm.Panel.Pane>
        </DualPaneForm.Panel>
      </DualPaneForm>
    </FormProvider>
  );
}
