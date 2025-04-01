import { useShoppingListItemsActions, useShoppingListItemsState } from "../reducers/ShoppingListItemsReducer";

import Button from "react-bootstrap/esm/Button";
import { FaFilter } from "react-icons/fa6";
import Heading from "@/components/Heading";
import Offcanvas from "react-bootstrap/esm/Offcanvas";
import ProductItem from "./ProductItem";
import { useLazySearchProductsQuery } from "@/apis/ProductsApi";
import { useState } from "react";

export default function BrowseProductsOffcanvas() {
  const { showOffcanvas } = useShoppingListItemsState();
  const { hideOffcanvas } = useShoppingListItemsActions();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchProducts, { data: productsPagination, isError, isLoading }] = useLazySearchProductsQuery();
  const numItems = productsPagination?.data.length || 0;
  const numPages = productsPagination?.meta.totalPages || 0;
  const totalItems = productsPagination?.meta.totalItems || 0;
  const searchTermUsed = productsPagination?.meta.search || "";
  const page = productsPagination?.meta.currentPage || 1;
  const totalPages = productsPagination?.meta.totalPages || 1;
  const handleSearch = (term: string) => {
    searchProducts({ paginateQuery: { page: 1, limit: 10, search: term, searchBy: ["name", "description"] } });
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
          <ul>
            {productsPagination.data.map((product) => (
              <li key={product.id}>
                <ProductItem product={product} />
              </li>
            ))}
          </ul>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
