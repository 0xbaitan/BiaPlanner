import { FaCheckCircle, FaSave } from "react-icons/fa";
import { useEffect, useMemo } from "react";
import { useMarkShoppingDoneActions, useMarkShoppingDoneState } from "../reducers/MarkShoppingDoneReducer";

import BrowseProductsOffcanvas from "./BrowseProductsOffcanvas";
import Button from "react-bootstrap/esm/Button";
import DualPaneForm from "@/components/forms/DualPaneForm";
import { FormProvider } from "react-hook-form";
import Heading from "@/components/Heading";
import { IShoppingList } from "@biaplanner/shared";
import MarkShoppingItemsTable from "./MarkShoppingItemsTable";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export type MarkShoppingDoneFormProps = {
  disableSubmit?: boolean;
  initialValue: IShoppingList;
};

export default function MarkShoppingDoneForm(props: MarkShoppingDoneFormProps) {
  const { disableSubmit } = props;
  const { initialValue } = props;
  const navigate = useNavigate();
  const { initialiseFormState, openEditMode, resetFormState, closeEditMode, hideOffcanvas, showAddExtraOffcanvas } = useMarkShoppingDoneActions();
  const { updatedShoppingItems, isInitialised, isInEditMode, transientUpdatedShoppingItems, offCanvasType, showOffcanvas } = useMarkShoppingDoneState();
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

  return (
    <div>
      <BrowseProductsOffcanvas hideOffcanvas={hideOffcanvas} showOffcanvas={showOffcanvas} type={offCanvasType === "add-extra" ? "add-extra" : "add-extra"} />
      <DualPaneForm>
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
          <DualPaneForm.Panel.Pane>
            <Heading level={Heading.Level.H2} className="bp-shopping_list_form__shopping_list_details__title">
              Review Shopping Items
            </Heading>
            <p className="bp-shopping_list_form__shopping_list_details__subtitle">Review your purchased items, and make any amends as necessary prior to adding them to your pantry.</p>

            {!isInEditMode && (
              <Button variant="outline-secondary" onClick={() => openEditMode()} className="bp-shopping_list_form__make_amends_btn">
                Edit items
              </Button>
            )}
            {isInEditMode && (
              <Button variant="outline-secondary" onClick={() => closeEditMode(true)}>
                Save changes
              </Button>
            )}
            {isInEditMode && (
              <Button variant="outline-danger" onClick={() => closeEditMode(false)} className="bp-shopping_list_form__cancel_amends_btn">
                Cancel changes
              </Button>
            )}
            {isInEditMode && (
              <Button variant="outline-secondary" onClick={() => showAddExtraOffcanvas()} className="bp-shopping_list_form__add_extra_btn">
                Add extra items
              </Button>
            )}
            <Button variant="outline-secondary" className="bp-shopping_list_form__review_changes_btn">
              Review amends
            </Button>
            <MarkShoppingItemsTable data={itemsToShow} />
          </DualPaneForm.Panel.Pane>
        </DualPaneForm.Panel>
      </DualPaneForm>
    </div>
  );
}
