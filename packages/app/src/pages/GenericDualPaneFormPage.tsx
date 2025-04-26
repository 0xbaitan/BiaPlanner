import Button from "react-bootstrap/Button";
import DualPaneForm from "@/components/forms/DualPaneForm";
import React from "react";
import Spinner from "react-bootstrap/Spinner";

interface GenericDualPaneFormPageProps {
  breadcrumbs?: React.ReactNode; // Breadcrumbs at the top
  headerTitle: string; // Title for the header
  headerActions?: React.ReactNode; // Actions for the header
  leftPaneContent?: React.ReactNode; // Content for the left pane
  rightPaneContent?: React.ReactNode; // Content for the right pane
  isLoading?: boolean; // Whether the page is in a loading state
  errorMessage?: string; // Error message to display if there's an error
  onRetry?: () => void; // Retry action for error state
}

export default function GenericDualPaneFormPage({ breadcrumbs, headerTitle, headerActions, leftPaneContent, rightPaneContent, isLoading, errorMessage, onRetry }: GenericDualPaneFormPageProps) {
  return (
    <DualPaneForm>
      {/* Header */}
      <DualPaneForm.Header>
        <DualPaneForm.Header.Title>{headerTitle}</DualPaneForm.Header.Title>
        <DualPaneForm.Header.Actions>{headerActions}</DualPaneForm.Header.Actions>
      </DualPaneForm.Header>

      {/* Breadcrumbs */}
      {breadcrumbs && <div className="bp-form__breadcrumbs">{breadcrumbs}</div>}

      {/* Dual Pane Content */}
      <DualPaneForm.Panel>
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
          <>
            <DualPaneForm.Panel.Pane>{leftPaneContent}</DualPaneForm.Panel.Pane>
            <DualPaneForm.Panel.Pane>{rightPaneContent}</DualPaneForm.Panel.Pane>
          </>
        )}
      </DualPaneForm.Panel>
    </DualPaneForm>
  );
}
