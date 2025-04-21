import "./styles/CrudViewPageLayout.scss";

import { Breadcrumb, BreadcrumbItem, Col, Container, Row } from "react-bootstrap";

import Heading from "./Heading";
import React from "react";
import { useLocation } from "react-router-dom";

interface CrudViewPageLayoutProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function CrudViewPageLayout({ title, breadcrumbs, actions, children }: CrudViewPageLayoutProps) {
  const location = useLocation();
  return (
    <div className="bp-crud_view_page">
      <div className="bp-crud_view_page__header">
        <Breadcrumb className="bp-crud_view_page__header__breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={index} active={location.pathname === crumb.href} href={crumb.href}>
              {crumb.label}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>

        <div className="bp-crud_view_page__header__main">
          <div className="bp-crud_view_page__header__title">
            <Heading level={Heading.Level.H1}>{title}</Heading>
          </div>
          <div className="bp-crud_view_page__header__actions">{actions}</div>
        </div>
      </div>
      <div className="bp-crud_view_page__body">{children}</div>
    </div>
  );
}
