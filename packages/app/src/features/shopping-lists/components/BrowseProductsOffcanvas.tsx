import "../styles/BrowseProductsOffcanvas.scss";

import { FaFilter, FaMagnifyingGlass } from "react-icons/fa6";
import ProductCardList, { ShoppingListItemFunctions } from "./ProductCardList";
import { useCallback, useState } from "react";
import { useShoppingListItemsActions, useShoppingListItemsState } from "../reducers/ShoppingListItemsReducer";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Heading from "@/components/Heading";
import { IWriteShoppingItemDto } from "@biaplanner/shared";
import Offcanvas from "react-bootstrap/esm/Offcanvas";
import PaginationComponent from "@/components/PaginationComponent";
import calculatePaginationElements from "@/util/calculatePaginationElements";
import { useSearchProductsQuery } from "@/apis/ProductsApi";

export type BrowseProductsType = "normal" | "add-extra" | "replacement";
export type BrowseProductsOffcanvasProps = {
  showOffcanvas: boolean;
  hideOffcanvas: () => void;
  type: BrowseProductsType;
  replacedProductName?: string;
  shoppingListItemFunctions: ShoppingListItemFunctions;
};

export default function BrowseProductsOffcanvas(props: BrowseProductsOffcanvasProps) {
  const { showOffcanvas, hideOffcanvas, type, replacedProductName, shoppingListItemFunctions } = props;

  const [searchTerm, setSearchTerm] = useState("");
  const { setSearch, setPage } = useShoppingListItemsActions();

  const { paginateQuery } = useShoppingListItemsState();
  const searchTermUsed = paginateQuery.search ?? "";

  const { data: productsPagination, isLoading } = useSearchProductsQuery(paginateQuery, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });
  const { numItems, totalItems, numItemStartOnPage, numItemEndOnPage, totalPages, currentPage } = calculatePaginationElements(paginateQuery.limit ?? 25, productsPagination);

  const handleSearch = useCallback(() => {
    setSearch(searchTerm);
  }, [searchTerm, setSearch]);
  console.log(productsPagination);
  return (
    <Offcanvas show={showOffcanvas} onHide={hideOffcanvas} className="bp-browse_products_offcanvas" placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <Heading level={Heading.Level.H2}>
            {type === "normal" && "Browse products"}
            {type === "add-extra" && "Find and add extra products"}
            {type === "replacement" && (replacedProductName ? `Find a replacement for '${replacedProductName}'` : "Find a replacement product")}
          </Heading>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="bp-browse_products_offcanvas__body">
        <div className="bp-browse_products_offcanvas__search_area">
          <div className="bp-browse_products_offcanvas__search_area__input">
            <Form.Group>
              <Form.Control className="bp-browse_products_offcanvas__search_box" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." />
              <Form.Control.Feedback type="invalid">Please enter a non-empty search query.</Form.Control.Feedback>
            </Form.Group>
            <Button onClick={handleSearch} variant="primary" className="bp-browse_products_offcanvas__search_button">
              <FaMagnifyingGlass />
              &emsp;Search products
            </Button>
            <Button variant="secondary">
              <FaFilter />
              &emsp;Filter products
            </Button>
          </div>

          {numItems > 0 && (
            <div>
              <hr />
              <div className="bp-browse_products_offcanvas__search_result_counts">
                Showing {numItemStartOnPage} - {numItemEndOnPage} of {totalItems} products for "{searchTerm}"
              </div>
            </div>
          )}
          {(!productsPagination || numItems === 0) && !isLoading ? (
            <div className="bp-browse_products_offcanvas__no_results">
              <Heading level={Heading.Level.H3}>{searchTerm ? <>No products found for "{searchTermUsed}"</> : <>Search for products</>}</Heading>
              <p>{searchTerm ? "Try searching with different keywords or check the spelling." : "You can search for products by name or description."}</p>
            </div>
          ) : null}
          {productsPagination && (
            <div className="bp-browse_products_offcanvas__main">
              {isLoading && <div>Loading...</div>}
              <ProductCardList shoppingListItemFunctions={shoppingListItemFunctions} products={productsPagination.data} type={type} />
              <div className="bp-browse_products_offcanvas__main__pagination">
                <PaginationComponent
                  onPageChange={(page) => {
                    setPage(page);
                  }}
                  numberOfPagesToShowOnTruncation={8}
                  showFirstLast={totalPages >= 25}
                  numPages={totalPages}
                  currentPage={currentPage}
                />
              </div>
            </div>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
