import { BreadcrumbItemProps } from "@/components/forms/SinglePaneForm";
import Button from "react-bootstrap/Button";
import React from "react";
import SinglePaneForm from "@/components/forms/SinglePaneForm";
import Spinner from "react-bootstrap/Spinner";

interface GenericSinglePaneFormPageProps {
  breadcrumbs?: BreadcrumbItemProps[]; // Breadcrumbs at the top
  headerTitle: string; // Title for the header
  headerActions?: React.ReactNode; // Actions for the header
  paneContent?: React.ReactNode; // Content for the single pane
  isLoading?: boolean; // Whether the page is in a loading state
  errorMessage?: string; // Error message to display if there's an error
  onRetry?: () => void; // Retry action for error state
}

export default function GenericSinglePaneFormPage({ breadcrumbs, headerTitle, headerActions, paneContent, isLoading, errorMessage, onRetry }: GenericSinglePaneFormPageProps) {
  return <SinglePaneForm breadcrumbs={breadcrumbs} headerTitle={headerTitle} headerActions={headerActions} isLoading={isLoading} errorMessage={errorMessage} onRetry={onRetry} paneContent={paneContent} />;
}
