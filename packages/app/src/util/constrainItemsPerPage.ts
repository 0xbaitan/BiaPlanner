import { ItemsPerPageCount } from "@/components/CrudListPageLayout";

export default function constrainItemsPerPage(itemsPerPage: number | undefined): ItemsPerPageCount {
  if (itemsPerPage === 10 || itemsPerPage === 25 || itemsPerPage === 50 || itemsPerPage === 100) {
    return itemsPerPage;
  }

  if (itemsPerPage && itemsPerPage < 10) {
    return 10;
  }
  if (itemsPerPage && itemsPerPage > 100) {
    return 100;
  }
  return 25;
}
