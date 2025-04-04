import "../styles/MarkShoppingItemsTable.scss";

import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { IShoppingItem, IShoppingItemExtended } from "@biaplanner/shared";
import { addShoppingListItem, removeShoppingListItem } from "../reducers/ShoppingListItemsReducer";
import { useMarkShoppingDoneActions, useMarkShoppingDoneState } from "../reducers/MarkShoppingDoneReducer";

import Button from "react-bootstrap/esm/Button";
import { FaPencil } from "react-icons/fa6";
import Form from "react-bootstrap/esm/Form";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import dayjs from "dayjs";
import { getImagePath } from "@/util/imageFunctions";

export type MarkShoppingItemsTableProps = {
  data: IShoppingItemExtended[];
};
export default function MarkShoppingItemsTable(props: MarkShoppingItemsTableProps) {
  const { data } = props;
  const { isInEditMode } = useMarkShoppingDoneState();
  const { updateQuantity, updateExpiryDate } = useMarkShoppingDoneActions();
  return (
    <TabbedViewsTable<IShoppingItemExtended>
      data={data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "General Details",
          columnAccessorKeys: ["product", "quantity", "expiryDate"],
          default: true,
          columnDefs: [
            {
              header: "Product",
              cell: (cell) => {
                const product = cell.row.original.product;
                return (
                  <div className="bp-mark_shopping_items_table__product">
                    <img className="bp-mark_shopping_items_table__product__img" src={getImagePath(product?.cover)} alt={product?.name} />
                    <div className="bp-mark_shopping_items_table__product__details">
                      <div className="bp-mark_shopping_items_table__product__details__title">{product?.name}</div>
                      <div className="bp-mark_shopping_items_table__product__details__measurement">
                        <span>{product?.measurement.magnitude}</span>
                        <span>{product?.measurement.unit}</span>
                      </div>
                    </div>
                  </div>
                );
              },

              accessorKey: "product",
            },
            {
              header: "Quantity",
              cell: (cell) => {
                const quantity = cell.row.original.quantity;
                const id = cell.row.original.id;
                if (isInEditMode && id) {
                  return (
                    <div className="bp-product_item_card__quantity_actions">
                      <Button
                        variant="outline-primary"
                        className="bp-product_item_card__action_button"
                        size="sm"
                        disabled={quantity <= 1}
                        onClick={() => {
                          updateQuantity(id, quantity - 1);
                        }}
                      >
                        <FaMinus />
                      </Button>
                      <span className="bp-product_item_card__quantity">{quantity ?? 1}</span>
                      <Button
                        variant="primary"
                        className="bp-product_item_card__action_button"
                        size="sm"
                        onClick={() => {
                          updateQuantity(id, quantity + 1);
                        }}
                      >
                        <FaPlus />
                      </Button>
                    </div>
                  );
                }
                return <span>{quantity}</span>;
              },
              accessorKey: "quantity",
            },

            {
              header: "Expiry date",
              cell: (cell) => {
                const expiryDate = cell.row.original.expiryDate;
                if (isInEditMode) {
                  const id = cell.row.original.id;
                  return (
                    <Form.Control
                      type="date"
                      value={dayjs(expiryDate).format("YYYY-MM-DD")}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        if (id) {
                          updateExpiryDate(id, newDate);
                        }
                      }}
                    />
                  );
                }
                return <span>{dayjs(expiryDate).format("DD/MM/YYYY")}</span>;
              },

              accessorKey: "expiryDate",
            },
          ],
        },
      ]}
      actions={[
        {
          type: "edit",
          label: "Edit shopping list",
          icon: FaPencil,
          onClick(row) {
            console.log("Edit action triggered for row:", row);
          },
        },
        {
          type: "delete",
          label: "Delete shopping list",
          icon: FaTrash,
          onClick(row) {
            console.log("Delete action triggered for row:", row);
          },
        },
      ]}
    />
  );
}
