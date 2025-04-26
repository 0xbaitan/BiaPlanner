import "../styles/SinglePaneForm.scss";

import Col, { ColProps } from "react-bootstrap/esm/Col";
import Form, { FormProps } from "react-bootstrap/Form";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import { BreadcrumbItem } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Heading from "../Heading";
import React from "react";
import Row from "react-bootstrap/esm/Row";
import Spinner from "react-bootstrap/Spinner";
import { useLocation } from "react-router-dom";

export type BreadcrumbItemProps = {
  label: string; // Text for the breadcrumb
  href?: string; // Optional link for the breadcrumb
};

export type SinglePaneFormProps = FormProps & {
  breadcrumbs?: BreadcrumbItemProps[]; // Breadcrumbs at the top
  headerTitle?: string; // Title for the header
  headerActions?: React.ReactNode; // Actions for the header
  paneContent?: React.ReactNode; // Content for the pane
  isLoading?: boolean; // Whether the form is in a loading state
  errorMessage?: string; // Error message to display if there's an error
  onRetry?: () => void; // Retry action for error state
};

export default function SinglePaneForm(props: SinglePaneFormProps) {
  const { className, breadcrumbs, headerTitle, headerActions, paneContent, isLoading, errorMessage, onRetry, ...rest } = props;
  const location = useLocation();
  return (
    <Form className={`bp-form ${className ?? ""}`} {...rest}>
      <Container fluid>
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <div className="bp-form__breadcrumbs">
            {
              <Breadcrumb className="bp-crud_view_page__header__breadcrumbs">
                {breadcrumbs.map((crumb, index) => (
                  <BreadcrumbItem key={index} active={location.pathname === crumb.href} href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbItem>
                ))}
              </Breadcrumb>
            }
          </div>
        )}

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
          <Col className="bp-form__single_panel__pane">
            {isLoading ? (
              <div className="bp-form__loading">
                <Spinner animation="border" role="status" className="bp-form__loading__spinner">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="bp-form__loading__message">Loading data, please wait...</p>
              </div>
            ) : errorMessage ? (
              <div className="bp-form__error">
                <p className="bp-form__error__message">{errorMessage}</p>
                {onRetry && (
                  <Button variant="primary" onClick={onRetry} className="bp-form__error__retry_button">
                    Retry
                  </Button>
                )}
              </div>
            ) : (
              paneContent
            )}
          </Col>
        </Row>
      </Container>
    </Form>
  );
}
