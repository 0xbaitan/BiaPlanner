import { FaPencilAlt } from "react-icons/fa";
import { IBrand } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { useDeletionToast } from "@/components/toasts/DeletionToast";
import { useNavigate } from "react-router-dom";

export type BrandsTableProps = {
  data: IBrand[];
};

export default function BrandsTable(props: BrandsTableProps) {
  const { data } = props;
  const navigate = useNavigate();
  const { notify } = useDeletionToast<IBrand>({
    identifierSelector: (brand) => brand.name,
    onConfirm: async (item) => {
      console.log("Deleting brand", item);
    },
  });

  return (
    <TabbedViewsTable<IBrand>
      data={data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["name", "description"],
          columnDefs: [
            {
              header: "Name",
              accessorFn: (row) => row.name,
            },
            {
              header: "Logo",

              cell: (cell) => {
                const fileName = cell.row.original.logo?.fileName;
                return <img src={`http://localhost:4000/uploads/${fileName}`} alt={fileName} style={{ width: 50, height: 50 }} />;
              },
            },
            {
              header: "Description",
              accessorFn: (row) => row.description,
            },
          ],
        },
      ]}
      actions={[
        {
          icon: FaPencilAlt,
          label: "Update Brand Details",
          type: "edit",
          onClick: (row) => {
            navigate(`./update/${row.id}`);
          },
        },

        {
          icon: FaPencilAlt,
          label: "Delete Brand",
          type: "delete",
          onClick: (row) => {
            notify(row);
          },
        },
      ]}
      showSerialNumber={true}
    />
  );
}
