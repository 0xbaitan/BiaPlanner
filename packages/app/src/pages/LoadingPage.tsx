import CrudViewPageLayout from "@/components/CrudViewPageLayout";
import React from "react";
import Spinner from "react-bootstrap/Spinner";

interface CrudActionLoadingPageProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
  message?: string;
}

export default function CrudActionLoadingPage({ title, breadcrumbs, message }: CrudActionLoadingPageProps) {
  return (
    <CrudViewPageLayout title={title} breadcrumbs={breadcrumbs}>
      <div className="bp-crud_action_loading_page">
        <Spinner animation="border" role="status" className="bp-crud_action_loading_page__spinner">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
    <p className="bp-crud_action_loading_page__message">{message || "Please wait while the action is being processed."}</p>
      </div>
    </CrudViewPageLayout>
  );
}
