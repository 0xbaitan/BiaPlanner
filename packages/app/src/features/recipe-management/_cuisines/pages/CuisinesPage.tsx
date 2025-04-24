import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import CuisinesTable from "../components/CuisinesTable";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import { useGetCuisinesQuery } from "@/apis/CuisinesApi";
import { useNavigate } from "react-router-dom";

export default function CuisinesPage() {
  const navigate = useNavigate();
  const { data: cuisines, isSuccess, isError } = useGetCuisinesQuery();

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        pageTitle="Cuisines"
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate("./create")}>
              <FaPlus />
              &ensp;Create Cuisine
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={cuisines?.length ?? 0} itemsStart={1} itemsEnd={cuisines?.length ?? 0} itemDescription="cuisines" />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isError || !cuisines || cuisines.length === 0 ? <NoResultsFound title="Oops! No cuisines found" description="Try creating a new cuisine to get started." /> : <CuisinesTable data={cuisines} />}
          </CrudListPageLayout.Body.Content>
        }
      />
    </CrudListPageLayout>
  );
}
