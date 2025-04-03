import "../styles/BrowseProductsOffcanvas.scss";

import { FaFilter, FaMagnifyingGlass } from "react-icons/fa6";
import { useShoppingListItemsActions, useShoppingListItemsState } from "../reducers/ShoppingListItemsReducer";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Heading from "@/components/Heading";
import Offcanvas from "react-bootstrap/esm/Offcanvas";
import PaginationComponent from "@/components/PaginationComponent";
import ProductItemCardList from "./ProductItemCardList";
import { useLazySearchProductsQuery } from "@/apis/ProductsApi";
import { useState } from "react";

export default function BrowseProductsOffcanvas() {
  const { showOffcanvas } = useShoppingListItemsState();
  const { hideOffcanvas } = useShoppingListItemsActions();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchProducts, { data: productsPagination, isLoading }] = useLazySearchProductsQuery();
  const numItems = productsPagination?.data.length || 0;
  const currentPage = productsPagination?.meta.currentPage || 1;
  const totalItems = productsPagination?.meta.totalItems || 0;
  const searchTermUsed = productsPagination?.meta.search || undefined;
  const limit = 10;
  const numItemStartOnPage = (currentPage - 1) * limit + 1;
  const numItemEndOnPage = Math.min(currentPage * limit, totalItems);

  const totalPages = productsPagination?.meta.totalPages || 1;
  const handleSearch = (term: string) => {
    searchProducts({ paginateQuery: { page: currentPage, limit, search: term, searchBy: ["name", "description"] } });
  };

  return (
    <Offcanvas show={showOffcanvas} onHide={hideOffcanvas} backdrop="static" placement="end" scroll>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <Heading level={Heading.Level.H2}>Browse products</Heading>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="bp-browse_products_offcanvas__body">
        <div className="bp-browse_products_offcanvas__search_area">
          <div className="bp-browse_products_offcanvas__search_area__input">
            <Form.Group>
              <Form.Control className="bp-browse_products_offcanvas__search_box" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." isInvalid={searchTerm.trim().length === 0} />
              <Form.Control.Feedback type="invalid">Please enter a non-empty search query.</Form.Control.Feedback>
            </Form.Group>
            <Button onClick={() => handleSearch(searchTerm)} disabled={searchTerm.trim().length === 0} variant="primary" className="bp-browse_products_offcanvas__search_button">
              <FaMagnifyingGlass />
              &emsp;Search products
            </Button>
            <Button variant="secondary">
              <FaFilter />
              &emsp;Filter products
            </Button>
          </div>
          <div>
            {numItems > 0 && (
              <div>
                <hr />
                <div className="bp-browse_products_offcanvas__search_result_counts">
                  Showing {numItemStartOnPage} - {numItemEndOnPage} of {totalItems} products for "{searchTermUsed}"
                </div>
              </div>
            )}
          </div>
        </div>
        {(!productsPagination || numItems === 0) && !isLoading ? (
          <div className="bp-browse_products_offcanvas__no_results">
            <Heading level={Heading.Level.H3}>{searchTermUsed ? <>No products found for "{searchTermUsed}"</> : <>Search for products</>}</Heading>
            <p>{searchTermUsed ? "Try searching with different keywords or check the spelling." : "You can search for products by name or description."}</p>
          </div>
        ) : null}

        {productsPagination && (
          <div className="bp-browse_products_offcanvas__main">
            {isLoading && <div>Loading...</div>}
            <ProductItemCardList products={productsPagination.data} />
            <div className="bp-browse_products_offcanvas__main__pagination">
              <PaginationComponent
                currentPage={currentPage}
                numPages={totalPages}
                numberOfPagesToShowOnTruncation={8}
                showFirstLast={totalPages >= 25}
                onPageChange={(page) => {
                  searchProducts({ paginateQuery: { page, limit: 10, search: searchTermUsed, searchBy: ["name", "description"] } });
                }}
              />
            </div>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
