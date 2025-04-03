import { FaCheckCircle, FaSave } from "react-icons/fa";

import Button from "react-bootstrap/esm/Button";
import DualPaneForm from "@/components/forms/DualPaneForm";
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
  return (
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
          <Button variant="outline-secondary" className="bp-shopping_list_form__make_amends_btn">
            Make amends
          </Button>
          <Button variant="outline-secondary" className="bp-shopping_list_form__review_changes_btn">
            Review changes
          </Button>
          <MarkShoppingItemsTable data={initialValue.items ?? []} />
        </DualPaneForm.Panel.Pane>
      </DualPaneForm.Panel>
    </DualPaneForm>
  );
}
