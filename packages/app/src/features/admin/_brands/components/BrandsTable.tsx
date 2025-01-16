import { FaPencilAlt } from "react-icons/fa";
import { IBrand } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";

export type BrandsTableProps = {
  data: IBrand[];
};

export default function BrandsTable(props: BrandsTableProps) {
  const { data } = props;

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
          label: "Edit Brand Details",
          type: "edit",
          onClick: (row) => {
            console.log("Edit brand clicked", row.name);
          },
        },
      ]}
      showSerialNumber={true}
    />
  );
}
