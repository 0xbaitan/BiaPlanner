import "./styles/CrudListPageLayout.scss";

import { HTMLProps, useState } from "react";
import PaginationComponent, { PaginationComponentProps } from "./PaginationComponent";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { FormSelectProps } from "react-bootstrap/esm/FormSelect";
import Heading from "./Heading";
import React from "react";

export type CrudListPageHeaderProps = HTMLProps<HTMLDivElement> & {
  pageTitle: string;
  onSearch?: (searchTerm: string) => void;
};
export type CrudListPageLayoutProps = HTMLProps<HTMLDivElement>;

function Header(props: CrudListPageHeaderProps) {
  const { className, children, pageTitle, onSearch, ...rest } = props;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const actionsSegment = React.Children.toArray(children).find((child) => {
    if (!React.isValidElement(child)) return false;
    return child.type === Actions;
  }) as React.ReactElement | null;
  const filterArea = React.Children.toArray(children).find((child) => {
    if (!React.isValidElement(child)) return false;
    return child.type === Filters;
  }) as React.ReactElement | null;

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
        <div className="bp-crud_list_page_layout__header__actions_area__actions">{actionsSegment}</div>
      </div>
      {filterArea && <div className="bp-crud_list_page_layout__header__filter_area">{filterArea}</div>}
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
  searchTermUse?: string;
};

function Body(props: HTMLProps<HTMLDivElement>) {
  const { className, children, ...rest } = props;
  const resultsCount = React.Children.toArray(children).find((child) => {
    if (!React.isValidElement(child)) return false;
    return child.type === ResultsCount;
  }) as React.ReactElement | null;
  const content = React.Children.toArray(children).find((child) => {
    if (!React.isValidElement(child)) return false;
    return child.type === Content;
  }) as React.ReactElement | null;
  const itemsPerPageCountSelector = React.Children.toArray(children).find((child) => {
    if (!React.isValidElement(child)) return false;
    return child.type === ItemsPerPageCountSelector;
  }) as React.ReactElement | null;
  return (
    <div {...rest} className={`bp-crud_list_page_layout__body ${className || ""}`}>
      <div className="bp-crud_list_page_layout__pagination_meta">
        {resultsCount && <div className="bp-crud_list_page_layout__body__results_count_area">{resultsCount}</div>}
        {itemsPerPageCountSelector && <div className="bp-crud_list_page_layout__body__items_per_page_count_area">{itemsPerPageCountSelector}</div>}
      </div>
      {content && <div className="bp-crud_list_page_layout__body__content_area">{content}</div>}
    </div>
  );
}

function ResultsCount(props: ResultsCountProps) {
  const {
    className,
    itemsEnd,
    itemsStart,
    totalItems,
    itemDescription,
    searchTermUse,

    ...rest
  } = props;

  return (
    <div {...rest} className={`bp-crud_list_page_layout__results_count ${className || ""}`}>
      Showing {itemsStart} - {itemsEnd} of {totalItems} {itemDescription || "items"} {searchTermUse && <span>for "{searchTermUse}"</span>}
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

function CrudListPageLayout(props: CrudListPageLayoutProps) {
  return <div {...props} className={`bp-crud_list_page_layout ${props.className || ""}`}></div>;
}

export type CrudListPageFooterProps = HTMLProps<HTMLDivElement>;
function Footer(props: CrudListPageFooterProps) {
  const { className, children, ...rest } = props;
  return (
    <div {...rest} className={`bp-crud_list_page_layout__footer ${className || ""}`}>
      {children}
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

Header.Actions = Actions;
Header.Filters = Filters;
CrudListPageLayout.Header = Header;
CrudListPageLayout.Body = Body;
CrudListPageLayout.Footer = Footer;

export default CrudListPageLayout;
