import { IPantryItem } from "@biaplanner/shared";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { pantryItemsTableConfig } from "../config/PantryItemsTableConfig";

export type PantryItemsTableProps = {
  data: IPantryItem[];
};

export default function PantryItemsTable(props: PantryItemsTableProps) {
  return <TabbedViewsTable<IPantryItem> {...pantryItemsTableConfig} data={props.data} />;
}
