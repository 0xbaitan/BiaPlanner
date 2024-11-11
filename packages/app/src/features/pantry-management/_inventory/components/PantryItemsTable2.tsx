import { IPantryItem } from "@biaplanner/shared";
import { PantryItemsTableProps } from "./PantryItemsTable";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import { pantryItemsTableConfig } from "../config/PantryItemsTableConfig";

export default function PantryItemsTable2(props: PantryItemsTableProps) {
  return <TabbedViewsTable<IPantryItem> {...pantryItemsTableConfig} data={props.data} />;
}
