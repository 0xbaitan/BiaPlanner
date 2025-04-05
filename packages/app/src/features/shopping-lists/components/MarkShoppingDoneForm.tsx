import "../styles/MarkShoppingDoneForm.scss";

import { FaCheckCircle, FaSave } from "react-icons/fa";
import { IShoppingList, IUpdateShoppingItemExtendedDto, IUpdateShoppingListExtendedDto } from "@biaplanner/shared";
import { useCallback, useEffect, useMemo } from "react";
import { useMarkShoppingDoneActions, useMarkShoppingDoneState } from "../reducers/MarkShoppingDoneReducer";

import BrowseProductsOffcanvas from "./BrowseProductsOffcanvas";
import Button from "react-bootstrap/esm/Button";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { FormProvider } from "react-hook-form";
import Heading from "@/components/Heading";
import MarkShoppingItemsTable from "./MarkShoppingItemsTable";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export type MarkShoppingDoneFormProps = {
  disableSubmit?: boolean;
  initialValue: IShoppingList;
  onSubmit: (values: IUpdateShoppingListExtendedDto) => void;
};

export default function MarkShoppingDoneForm(props: MarkShoppingDoneFormProps) {
  const { initialValue, disableSubmit, onSubmit } = props;
  const navigate = useNavigate();
  const { initialiseFormState, openEditMode, resetFormState, closeEditMode, hideOffcanvas, showAddExtraOffcanvas } = useMarkShoppingDoneActions();
  const { updatedShoppingItems, isInitialised, isInEditMode, transientUpdatedShoppingItems, offCanvasType, showOffcanvas, currentItemToReplace } = useMarkShoppingDoneState();
  const itemsToShow = useMemo(() => {
    if (isInEditMode) {
      return transientUpdatedShoppingItems;
    }
    return updatedShoppingItems;
  }, [isInEditMode, transientUpdatedShoppingItems, updatedShoppingItems]);
  console.log("updatedShoppingItems", updatedShoppingItems);
  useEffect(() => {
    if (!isInitialised) {
      initialiseFormState(initialValue);
    }
  }, [initialValue, initialiseFormState, isInitialised, resetFormState]);

  const handleSubmit = useCallback(() => {
    const dto: IUpdateShoppingListExtendedDto = {
      ...initialValue,
      items: updatedShoppingItems,
    };
    onSubmit(dto);
  }, [initialValue, onSubmit, updatedShoppingItems]);

  return (
    <div>
      <BrowseProductsOffcanvas hideOffcanvas={hideOffcanvas} showOffcanvas={showOffcanvas} type={offCanvasType ?? "normal"} replacedProductName={currentItemToReplace?.name} />
      <DualPaneForm
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <DualPaneForm.Header>
          <DualPaneForm.Header.Title>Mark shopping done</DualPaneForm.Header.Title>
          <DualPaneForm.Header.Actions>
            <Button type="button" variant="outline-secondary" onClick={() => navigate(-1)}>
              <MdCancel />
              <span className="ms-2">Cancel</span>
            </Button>
            <Button type="submit" disabled={disableSubmit}>
              <FaCheckCircle />
              <span className="ms-2">Mark done</span>
            </Button>
          </DualPaneForm.Header.Actions>
        </DualPaneForm.Header>

        <DualPaneForm.Panel>
          <DualPaneForm.Panel.Pane className="bp-mark_done_form__shopping_list_details">
            <div>
              <Heading level={Heading.Level.H2} className="bp-mark_done_form__shopping_list_details__title">
                Review Shopping Items
              </Heading>
              <p className="bp-mark_done_form__shopping_list_details__">Review your purchased items, and make any amends as necessary prior to adding them to your pantry.</p>
            </div>
            <div className="bp-mark_done_form__shopping_list_details__actions">
              {isInEditMode && (
                <Button variant="outline-primary" onClick={() => showAddExtraOffcanvas()} className="bp-mark_done_form__add_extra_btn">
                  Add extra items
                </Button>
              )}
              {!isInEditMode && (
                <Button variant="secondary" onClick={() => openEditMode()} className="bp-mark_done_form__make_amends_btn">
                  Amend Items
                </Button>
              )}
              {isInEditMode && (
                <Button variant="secondary" onClick={() => closeEditMode(true)}>
                  Save changes
                </Button>
              )}
              {isInEditMode && (
                <Button variant="danger" onClick={() => closeEditMode(false)} className="bp-mark_done_form__cancel_amends_btn">
                  Cancel changes
                </Button>
              )}
            </div>
            <div className="bp-mark_done_form__shopping_list_details__items">
              <MarkShoppingItemsTable data={itemsToShow} />
            </div>
          </DualPaneForm.Panel.Pane>
        </DualPaneForm.Panel>
      </DualPaneForm>
    </div>
  );
}
