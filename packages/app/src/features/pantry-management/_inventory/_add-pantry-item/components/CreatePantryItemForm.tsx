import { CreatePantryItemDto, IPantryItem, UpdatePantryItemDto } from "@biaplanner/shared";
import { ZodType, z } from "zod";

import Col from "react-bootstrap/esm/Col";
import Nav from "react-bootstrap/esm/Nav";
import Row from "react-bootstrap/esm/Row";
import Tab from "react-bootstrap/esm/Tab";
import { useForm } from "react-hook-form";
export type CreatePantryItemFormData = CreatePantryItemDto;

export type CreatePantryItemFormProps = {
  initialValues?: CreatePantryItemFormData;
  onSubmit: (data: CreatePantryItemFormData) => void;
};

export default function PantryItemForm(props: CreatePantryItemFormProps) {
  const pantryItemForm = useForm<CreatePantryItemFormData>({
    defaultValues: props.initialValues,
    shouldFocusError: true,
    mode: "onBlur",
  });
  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="first">Tab 1</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">Tab 2</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="first">First tab content</Tab.Pane>
            <Tab.Pane eventKey="second">Second tab content</Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}
