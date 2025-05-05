import { useRolesCrudListActions, useRolesCrudListState } from "../reducers/RolesCrudListReducer";

import Button from "react-bootstrap/esm/Button";
import CrudListPageLayout from "@/components/CrudListPageLayout";
import { FaPlus } from "react-icons/fa";
import NoResultsFound from "@/components/NoResultsFound";
import RolesTable from "../components/RolesTable";
import { RoutePaths } from "@/Routes";
import calculatePaginationElements from "@/util/calculatePaginationElements";
import constrainItemsPerPage from "@/util/constrainItemsPerPage";
import { useNavigate } from "react-router-dom";
import { useSearchRolesQuery } from "@/apis/RolesApi";

export default function RolesPage() {
  const navigate = useNavigate();
  const { rolesQuery } = useRolesCrudListState();
  const { setSearch, setPage, setLimit } = useRolesCrudListActions();
  const { data: roles, isError } = useSearchRolesQuery(rolesQuery, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { currentPage, totalItems, numItemStartOnPage, numItemEndOnPage, searchTermUsed, totalPages } = calculatePaginationElements(rolesQuery.limit ?? 25, roles);

  return (
    <CrudListPageLayout>
      <CrudListPageLayout.Header
        pageTitle="Roles"
        searchTerm={rolesQuery.search}
        onSearch={(searchTerm) => {
          setSearch(searchTerm);
        }}
        actionsComponent={
          <CrudListPageLayout.Header.Actions>
            <Button variant="primary" onClick={() => navigate(RoutePaths.ROLES_CREATE)}>
              <FaPlus />
              &ensp;Create Role
            </Button>
          </CrudListPageLayout.Header.Actions>
        }
      />

      <CrudListPageLayout.Body
        resultsCountComponent={<CrudListPageLayout.Body.ResultsCount totalItems={totalItems} itemsStart={numItemStartOnPage} itemsEnd={numItemEndOnPage} itemDescription="roles" searchTermUsed={searchTermUsed} />}
        contentComponent={
          <CrudListPageLayout.Body.Content>
            {isError || !roles?.data || roles.data.length === 0 ? <NoResultsFound title="Oops! No roles found" description="Try creating a new role to get started." /> : <RolesTable data={roles.data} />}
          </CrudListPageLayout.Body.Content>
        }
        itemsPerPageCountSelectorComponent={
          <CrudListPageLayout.Body.ItemsPerPageCountSelector
            itemsCount={constrainItemsPerPage(rolesQuery.limit ?? 25)}
            onChange={(limit) => {
              setLimit(limit);
            }}
          />
        }
      />

      <CrudListPageLayout.Footer
        paginationComponent={
          <CrudListPageLayout.Footer.Pagination
            paginationProps={{
              numPages: totalPages,
              currentPage,
              onPageChange: (page) => {
                setPage(page);
              },
            }}
          />
        }
      />
    </CrudListPageLayout>
  );
}
