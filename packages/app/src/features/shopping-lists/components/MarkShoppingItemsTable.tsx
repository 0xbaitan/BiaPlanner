import "../styles/MarkShoppingItemsTable.scss";

import { FaMinus, FaPlus, FaTrash, FaTrashRestore } from "react-icons/fa";
import { FaPencil, FaXmark } from "react-icons/fa6";
import { IShoppingItem, IShoppingItemExtended } from "@biaplanner/shared";
import { useMarkShoppingDoneActions, useMarkShoppingDoneState } from "../reducers/MarkShoppingDoneReducer";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { RxReset } from "react-icons/rx";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import dayjs from "dayjs";
import { getImagePath } from "@/util/imageFunctions";

export type MarkShoppingItemsTableProps = {
  data: IShoppingItemExtended[];
};
export default function MarkShoppingItemsTable(props: MarkShoppingItemsTableProps) {
  const { data } = props;
  const { isInEditMode, transientUpdatedShoppingItems, originalShoppingItems } = useMarkShoppingDoneState();
  const { updateQuantity, updateExpiryDate, cancelShoppingItem, uncancelShoppingItem, getIsItemOriginal, resetItemToOriginal } = useMarkShoppingDoneActions();

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
              header: "Status",
              cell: (cell) => {
                const isCancelled = cell.row.original.isCancelled;
                return isCancelled ? <div className="bp-mark_shopping_items_table__status_pill cancelled">Cancelled</div> : <div className="bp-mark_shopping_items_table__status_pill active">Active</div>;
              },
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
                const canExpire = cell.row.original.product?.canExpire;
                if (isInEditMode) {
                  const id = cell.row.original.id;
                  return canExpire ? (
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
                  ) : (
                    <span>N/A</span>
                  );
                }
                return <span>{canExpire ? dayjs(expiryDate).format("DD/MM/YYYY") : "N/A"}</span>;
              },

              accessorKey: "expiryDate",
            },

            {
              header: "Actions",
              cell: (cell) => {
                const id = cell.row.original.id;
                const isCancelled = cell.row.original.isCancelled;
                const isOriginal = id ? getIsItemOriginal(id) : false;
                if (!isInEditMode) {
                  return null;
                }
                return (
                  <div className="bp-mark_shopping_items_table__actions">
                    {!isCancelled && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          if (id) {
                            cancelShoppingItem(id);
                          }
                        }}
                      >
                        <FaTrash />
                        &emsp;Cancel item
                      </Button>
                    )}
                    {isCancelled && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          if (id) {
                            uncancelShoppingItem(id);
                          }
                        }}
                      >
                        <FaTrashRestore />
                        &emsp;Restore item
                      </Button>
                    )}
                    {!isOriginal && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          if (id) {
                            resetItemToOriginal(id);
                          }
                        }}
                      >
                        <RxReset />
                        &emsp;Reset all
                      </Button>
                    )}
                  </div>
                );
              },
            },
          ],
        },
      ]}
    />
  );
}
