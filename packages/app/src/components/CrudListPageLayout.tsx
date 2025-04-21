import "./styles/CrudListPageLayout.scss";

import { HTMLProps, memo, useMemo, useState } from "react";
import PaginationComponent, { PaginationComponentProps } from "./PaginationComponent";
import ViewSegmentedButtonComponent, { ViewSegmentedButtonProps } from "./ViewSegmentedButton";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { FormSelectProps } from "react-bootstrap/esm/FormSelect";
import Heading from "./Heading";
import React from "react";

export type CrudListPageHeaderProps = Omit<HTMLProps<HTMLDivElement>, "children"> & {
  pageTitle: string;
  searchTerm?: string;
  onSearch?: (searchTerm: string) => void;
  actionsComponent?: React.ReactNode;
  filtersComponent?: React.ReactNode;
};
export type CrudListPageLayoutProps = HTMLProps<HTMLDivElement>;

function Header(props: CrudListPageHeaderProps) {
  const { className, searchTerm: initialTerm, actionsComponent, filtersComponent, pageTitle, onSearch, ...rest } = props;
  const [searchTerm, setSearchTerm] = useState<string>(initialTerm || "");

  return (
    <div {...rest} className={`bp-crud_list_page_layout__header ${className || ""}`}>
      <div className="bp-crud_list_page_layout__header__heading_area">
        <Heading level={Heading.Level.H1} className="bp-crud_list_page_layout__header__title">
          {pageTitle}
        </Heading>
      </div>
      <div className="bp-crud_list_page_layout__header__actions_area">
        <div className="bp-crud_list_page_layout__header__actions_area__search">
          <Form.Control
            type="text"
            placeholder="Search..."
            className="bp-crud_list_page_layout__header__search_input"
            onChange={(e) => {
              const term = e.target.value.trim();
              setSearchTerm(term);
            }}
          />
          <Button
            variant="primary"
            className="bp-crud_list_page_layout__header__search_button"
            onClick={() => {
              onSearch?.(searchTerm);
            }}
          >
            Search
          </Button>
        </div>
        <div className="bp-crud_list_page_layout__header__actions_area__actions">{actionsComponent}</div>
      </div>
      {filtersComponent && <div className="bp-crud_list_page_layout__header__filter_area">{filtersComponent}</div>}
    </div>
  );
}

function Filters(props: HTMLProps<HTMLDivElement>) {
  const { className, children, ...rest } = props;
  return (
    <div {...rest} className={`bp-crud_list_page_layout__filter_area ${className || ""}`}>
      {children}
    </div>
  );
}

function Actions(props: HTMLProps<HTMLDivElement>) {
  const { className, children, ...rest } = props;
  return (
    <div {...rest} className={`bp-crud_list_page_layout__actions_segment ${className || ""}`}>
      {children}
    </div>
  );
}

export type ResultsCountProps = Omit<HTMLProps<HTMLDivElement>, "children"> & {
  itemsStart: number;
  itemsEnd: number;
  totalItems: number;
  itemDescription?: string;
  searchTermUsed?: string;
};

export type CrudListBodyProps = Omit<HTMLProps<HTMLDivElement>, "children"> & {
  resultsCountComponent?: React.ReactNode;
  contentComponent?: React.ReactNode;
  itemsPerPageCountSelectorComponent?: React.ReactNode;
  viewSegmentedButtonComponent?: React.ReactNode;
};

function Body(props: CrudListBodyProps) {
  const { className, resultsCountComponent, contentComponent, itemsPerPageCountSelectorComponent, viewSegmentedButtonComponent, ...rest } = props;

  return (
    <div {...rest} className={`bp-crud_list_page_layout__body ${className || ""}`}>
      <div className="bp-crud_list_page_layout__pagination_meta">
        {resultsCountComponent && <div className="bp-crud_list_page_layout__body__results_count_area">{resultsCountComponent}</div>}
        <div className="bp-crud_list_page_layout__body__layout_settings">
          {itemsPerPageCountSelectorComponent && <div className="bp-crud_list_page_layout__body__items_per_page_count_area">{itemsPerPageCountSelectorComponent}</div>}
          {viewSegmentedButtonComponent}
        </div>
      </div>
      {contentComponent && <div className="bp-crud_list_page_layout__body__content_area">{contentComponent}</div>}
    </div>
  );
}

function ResultsCount(props: ResultsCountProps) {
  const { className, itemsEnd, itemsStart, totalItems, itemDescription, searchTermUsed, ...rest } = props;

  return (
    <div {...rest} className={`bp-crud_list_page_layout__results_count ${className || ""}`}>
      Showing {itemsStart} - {itemsEnd} of {totalItems} {itemDescription || "items"} {searchTermUsed && <>for "{searchTermUsed}"</>}
    </div>
  );
}

export type CrudListPageContentProps = HTMLProps<HTMLDivElement>;

function Content(props: CrudListPageContentProps) {
  const { className, children, ...rest } = props;
  return (
    <div {...rest} className={`bp-crud_list_page_layout__content ${className || ""}`}>
      {children}
    </div>
  );
}

export type ItemsPerPageCount = 10 | 25 | 50 | 100;
type CrudListPageItemsPerPageCountSelector = Omit<FormSelectProps, "onChange"> & {
  itemsCount: ItemsPerPageCount;
  onChange: (itemsCount: ItemsPerPageCount) => void;
};

function ItemsPerPageCountSelector(props: CrudListPageItemsPerPageCountSelector) {
  const { className, itemsCount, onChange, ...rest } = props;
  return (
    <div className="bp-crud_list_page_layout__items_per_page_count_selector_container">
      <div className="bp-crud_list_page_layout__items_per_page_count_selector_label">Items per page:</div>
      <Form.Select
        {...rest}
        className={`bp-crud_list_page_layout__items_per_page_count_selector ${className || ""}`}
        value={itemsCount}
        onChange={(e) => {
          const value = parseInt(e.target.value) as ItemsPerPageCount;
          onChange(value);
        }}
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </Form.Select>
    </div>
  );
}

function ViewSegmentedButton(props: ViewSegmentedButtonProps) {
  const { className, ...rest } = props;
  return <ViewSegmentedButtonComponent {...rest} className="bp-crud_list_page_layout__view_segmented_button__component" />;
}

function CrudListPageLayout(props: CrudListPageLayoutProps) {
  return <div {...props} className={`bp-crud_list_page_layout ${props.className || ""}`}></div>;
}

export type CrudListPageFooterProps = Omit<HTMLProps<HTMLDivElement>, "children"> & {
  paginationComponent?: React.ReactNode;
};
function Footer(props: CrudListPageFooterProps) {
  const { className, paginationComponent, ...rest } = props;
  return (
    <div {...rest} className={`bp-crud_list_page_layout__footer ${className || ""}`}>
      {paginationComponent && <div className="bp-crud_list_page_layout__footer__pagination_area">{paginationComponent}</div>}
    </div>
  );
}

export type CrudListPagePaginationProps = Omit<HTMLProps<HTMLDivElement>, "children"> & {
  paginationProps: PaginationComponentProps;
};
function Pagination(props: CrudListPagePaginationProps) {
  const { className, paginationProps, ...rest } = props;
  return (
    <div {...rest} className={`bp-crud_list_page_layout__footer__pagination ${className || ""}`}>
      <PaginationComponent {...paginationProps} className="bp-crud_list_page_layout__footer__pagination__component" />
    </div>
  );
}

Footer.Pagination = Pagination;

Body.ResultsCount = ResultsCount;
Body.Content = Content;
Body.ItemsPerPageCountSelector = ItemsPerPageCountSelector;
Body.ViewSegmentedButton = ViewSegmentedButton;

Header.Actions = Actions;
Header.Filters = Filters;
CrudListPageLayout.Header = Header;
CrudListPageLayout.Body = Body;
CrudListPageLayout.Footer = Footer;

export default CrudListPageLayout;
