import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import ProductsTable from "../components/ProductsTable";
import { useGetProductsQuery } from "@/apis/ProductsApi";
import { useNavigate } from "react-router-dom";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { data: products, isSuccess, isError } = useGetProductsQuery();

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        pageTitle="Products"
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate("./create")}>
              <FaPlus />
              &ensp;Add New Product
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={products?.length ?? 0} itemsStart={1} itemsEnd={products?.length ?? 0} itemDescription="products" />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isError || !products || products.length === 0 ? <NoResultsFound title="Oops! No products found" description="Try adding a new product to get started." /> : <ProductsTable data={products} />}
          </CrudListPageLayout.Body.Content>
        }
      />
    </CrudListPageLayout>
  );
}
