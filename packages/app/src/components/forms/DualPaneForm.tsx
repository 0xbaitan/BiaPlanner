import "../styles/DualPaneForm.scss";

import Col, { ColProps } from "react-bootstrap/esm/Col";
import Form, { FormProps } from "react-bootstrap/Form";
import Row, { RowProps } from "react-bootstrap/esm/Row";

import Container from "react-bootstrap/Container";
import { HTMLProps } from "react";
import Heading from "../Heading";
import React from "react";

export type DualPaneFormMainProps = FormProps;
export type DualPaneFormTitleProps = HTMLProps<HTMLHeadingElement>;
export type DualPaneFormHeaderProps = ColProps;
export type DualPaneFormPaneProps = ColProps;
export type DualPaneFormPanelProps = RowProps;

function Title(props: DualPaneFormTitleProps) {
  const { className, children, ...rest } = props;
  return (
    <Heading level={Heading.Level.H1} className={`bp-form__header__title ${className ?? " "}`} {...rest}>
      {children}
    </Heading>
  );
}

function Actions(props: HTMLProps<HTMLDivElement>) {
  const { className, children, ...rest } = props;
  return (
    <div className={`bp-form__header__actions ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}

function Header(props: DualPaneFormHeaderProps) {
  const { className, children, ...rest } = props;
  return (
    <Row>
      <Col className={`bp-form__header ${className ?? ""}`} {...rest}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          else if (child.type === Title) return <div>{child}</div>;
          else if (child.type === Actions) return <div>{child}</div>;
          else {
            return null;
          }
        })}
      </Col>
    </Row>
  );
}

function Pane(props: DualPaneFormPaneProps) {
  const { className, ...rest } = props;
  return <Col className={`bp-form__dual_panel__pane ${className ?? ""}`} {...rest} />;
}

function Panel(props: DualPaneFormPanelProps) {
  const { className, children, ...rest } = props;
  return (
    <Row className={`bp-form__dual_panel ${className ?? ""}`} {...rest}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        else if (child.type === Pane) return child;
        else {
          return null;
        }
      })}
    </Row>
  );
}

function Main(props: DualPaneFormMainProps) {
  const { className, children, ...rest } = props;
  return (
    <Form className={`bp-form ${className ?? ""}`} {...rest}>
      <Container fluid>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          else if (child.type === Header) return child;
          else if (child.type === Panel) return child;
          else {
            return null;
          }
        })}
      </Container>
    </Form>
  );
}

Header.Title = Title;
Header.Actions = Actions;
Panel.Pane = Pane;
Main.Header = Header;
Main.Panel = Panel;

const DualPaneForm = Main;

export default DualPaneForm;
