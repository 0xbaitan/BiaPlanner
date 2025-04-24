import BrandsTable from "../components/BrandsTable";
import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import { useGetBrandsQuery } from "@/apis/BrandsApi";
import { useNavigate } from "react-router-dom";

export default function AdminBrandsPage() {
  const navigate = useNavigate();
  const { data: brands, isSuccess, isError } = useGetBrandsQuery();

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        pageTitle="Brands"
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate("./create")}>
              <FaPlus />
              &ensp;Create Brand
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={brands?.length ?? 0} itemsStart={1} itemsEnd={brands?.length ?? 0} itemDescription="brands" />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isError || !brands || brands.length === 0 ? <NoResultsFound title="Oops! No brands found" description="Try creating a new brand to get started." /> : <BrandsTable data={brands} />}
          </CrudListPageLayout.Body.Content>
        }
      />
    </CrudListPageLayout>
  );
}
