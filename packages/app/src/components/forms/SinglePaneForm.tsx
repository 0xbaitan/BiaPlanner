import "../styles/SinglePaneForm.scss";

import Col, { ColProps } from "react-bootstrap/esm/Col";
import Form, { FormProps } from "react-bootstrap/Form";

import Container from "react-bootstrap/Container";
import Heading from "../Heading";
import React from "react";
import Row from "react-bootstrap/esm/Row";

export type SinglePaneFormProps = FormProps & {
  breadcrumbs?: React.ReactNode; // Breadcrumbs at the top
  headerTitle?: string; // Title for the header
  headerActions?: React.ReactNode; // Actions for the header
  paneContent?: React.ReactNode; // Content for the pane
};

export default function SinglePaneForm(props: SinglePaneFormProps) {
  const { className, breadcrumbs, headerTitle, headerActions, paneContent, ...rest } = props;

  return (
    <Form className={`bp-form ${className ?? ""}`} {...rest}>
      <Container fluid>
        {/* Breadcrumbs */}
        {breadcrumbs && <div className="bp-form__breadcrumbs">{breadcrumbs}</div>}

        {/* Header */}
        <Row>
          <Col className="bp-form__header">
            {headerTitle && (
              <Heading level={Heading.Level.H1} className="bp-form__header__title">
                {headerTitle}
              </Heading>
            )}
            {headerActions && <div className="bp-form__header__actions">{headerActions}</div>}
          </Col>
        </Row>

        {/* Pane */}
        <Row>
          <Col className="bp-form__single_panel__pane">{paneContent}</Col>
        </Row>
      </Container>
    </Form>
  );
}
