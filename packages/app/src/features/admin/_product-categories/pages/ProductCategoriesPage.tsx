import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import ProductCategoriesTable from "../components/ProductCategoriesTable";
import { useGetProductCategoriesQuery } from "@/apis/ProductCategoryApi";
import { useNavigate } from "react-router-dom";

export default function ProductCategoriesPage() {
  const navigate = useNavigate();
  const { data: productCategories, isSuccess, isError } = useGetProductCategoriesQuery();

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        pageTitle="Product Categories"
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate("./create")}>
              <FaPlus />
              &ensp;Create Product Category
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={productCategories?.length ?? 0} itemsStart={1} itemsEnd={productCategories?.length ?? 0} itemDescription="product categories" />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isError || !productCategories || productCategories.length === 0 ? (
              <NoResultsFound title="Oops! No product categories found" description="Try creating a new product category to get started." />
            ) : (
              <ProductCategoriesTable data={productCategories} />
            )}
          </CrudListPageLayout.Body.Content>
        }
      />
    </CrudListPageLayout>
  );
}
