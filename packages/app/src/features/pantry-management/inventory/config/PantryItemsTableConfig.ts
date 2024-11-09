import { TabbedViewsTableProps, TabbedViewsTableWithoutDataProps } from "@/components/tables/TabbedViewsTable";

import { BRAND_AND_CATEGORY_VIEW_DEF } from "./BrandAndCategoryViewDef";
import { IPantryItem } from "@biaplanner/shared";
import { QUANTITY_AND_MEASUREMENTS_VIEW_DEF } from "./QuantityAndMeasurementsView";

export const pantryItemsTableConfig: TabbedViewsTableWithoutDataProps<IPantryItem> = {
  views: [BRAND_AND_CATEGORY_VIEW_DEF, QUANTITY_AND_MEASUREMENTS_VIEW_DEF],
  leftPinnedAccessorKeys: ["brandedItemName"],
  showSerialNumber: true,
};
