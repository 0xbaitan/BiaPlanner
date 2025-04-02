import "../styles/BrowseProductsOffcanvas.scss";

import { useShoppingListItemsActions, useShoppingListItemsState } from "../reducers/ShoppingListItemsReducer";

import Button from "react-bootstrap/esm/Button";
import { FaFilter } from "react-icons/fa6";
import Heading from "@/components/Heading";
import Offcanvas from "react-bootstrap/esm/Offcanvas";
import PaginationComponent from "@/components/PaginationComponent";
import ProductItemCard from "./ProductItemCard";
import ProductItemCardList from "./ProductItemCardList";
import { useLazySearchProductsQuery } from "@/apis/ProductsApi";
import { useState } from "react";

export default function BrowseProductsOffcanvas() {
  const { showOffcanvas } = useShoppingListItemsState();
  const { hideOffcanvas } = useShoppingListItemsActions();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchProducts, { data: productsPagination, isError, isLoading }] = useLazySearchProductsQuery();
  const numItems = productsPagination?.data.length || 0;
  const [dummyCurrentPage, setDummyCurrentPage] = useState(1);
  const currentPage = productsPagination?.meta.currentPage || 1;
  const totalItems = productsPagination?.meta.totalItems || 0;
  const searchTermUsed = productsPagination?.meta.search || "";
  const page = productsPagination?.meta.currentPage || 1;
  const totalPages = productsPagination?.meta.totalPages || 1;
  const handleSearch = (term: string) => {
    searchProducts({ paginateQuery: { page: currentPage, limit: 10, search: term, searchBy: ["name", "description"] } });
  };

  return (
    <Offcanvas show={showOffcanvas} onHide={hideOffcanvas} backdrop="static" placement="end" scroll>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <Heading level={Heading.Level.H2}>Search Products</Heading>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." />
        <Button onClick={() => handleSearch(searchTerm)}>Search</Button>
        <Button variant="secondary">
          <FaFilter />
        </Button>
        <hr />
        <div>
          {numItems > 0 && (
            <div>
              <span>
                Showing {numItems} of {totalItems} products for "{searchTermUsed}"
              </span>
            </div>
          )}
        </div>
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error loading products</div>}
        {productsPagination && (
          <div className="bp-browse_products_offcanvas__main">
            <ProductItemCardList products={productsPagination.data} />
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
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
