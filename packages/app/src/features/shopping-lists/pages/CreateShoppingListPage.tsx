import { useLazySearchProductsQuery, useSearchProductsQuery } from "@/apis/ProductsApi";

import Button from "react-bootstrap/esm/Button";
import ShoppingListForm from "../components/ShoppingListForm";
import { useState } from "react";

export default function CreateShoppingListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchProducts, { data: products, isError, isLoading }] = useLazySearchProductsQuery();

  const handleSearch = (term: string) => {
    searchProducts({ paginateQuery: { page: 1, limit: 10, search: term, searchBy: ["name", "description"] } });
  };

  return (
    <>
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." />
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading products</div>}
      {products && (
        <ul>
          {products.data.map((product) => (
            <li key={product.id}>
              {product.name} - {product.description || "No description available"}
            </li>
          ))}
        </ul>
      )}
      <Button onClick={() => handleSearch(searchTerm)}>Search</Button>
      <ShoppingListForm onSubmit={() => {}} type="create" initialValue={undefined} />;
    </>
  );
}
