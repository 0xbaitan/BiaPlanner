import "../styles/MarkShoppingItemsTable.scss";

import { FaMinus, FaPlus, FaTrash, FaTrashRestore } from "react-icons/fa";
import { FaPencil, FaTrashCan, FaXmark } from "react-icons/fa6";
import { IShoppingItem, IShoppingItemExtended } from "@biaplanner/shared";
import { useMarkShoppingDoneActions, useMarkShoppingDoneState } from "../reducers/MarkShoppingDoneReducer";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { MdFindReplace } from "react-icons/md";
import Pill from "@/components/Pill";
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
  const { updateQuantity, updateExpiryDate, cancelShoppingItem, uncancelShoppingItem, getIsItemOriginal, resetItemToOriginal, removeExtraShoppingItem, showReplacementOffcanvas, getOriginalItem } = useMarkShoppingDoneActions();
  console.log("MarkShoppingItemsTable", data);
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
                const originalQty = getOriginalItem(cell.row.original.productId)?.quantity;
                const isReplaced = cell.row.original.isReplaced;
                const replacement = cell.row.original.replacement;
                let productToShow = isReplaced && replacement && replacement.product ? replacement.product : product;
                return (
                  <>
                    <div className="bp-mark_shopping_items_table__product">
                      <img className="bp-mark_shopping_items_table__product__img" src={getImagePath(productToShow?.cover)} alt={productToShow?.name} />
                      <div className="bp-mark_shopping_items_table__product__details">
                        <div className="bp-mark_shopping_items_table__product__details__title">{productToShow?.name}</div>
                        <div className="bp-mark_shopping_items_table__product__details__measurement">
                          <span>{productToShow?.measurement.magnitude}</span>
                          <span>{productToShow?.measurement.unit}</span>
                          {isReplaced && replacement && (
                            <div className="bp-mark_shopping_items_table__product__original_info">
                              Replaces {originalQty} of {product?.name} ({product?.measurement.magnitude}
                              {product?.measurement.unit})
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              },

              accessorKey: "product",
            },
            {
              header: "Status",
              cell: (cell) => {
                const item = cell.row.original;
                const isCancelled = item.isReplaced && !!item.replacement ? item.replacement.isCancelled : item.isCancelled;
                return isCancelled ? <Pill className="bp-mark_shopping_items_table__status_pill cancelled">Cancelled</Pill> : <Pill className="bp-mark_shopping_items_table__status_pill active">Active</Pill>;
              },
            },
            {
              header: "Quantity",
              cell: (cell) => {
                const item = cell.row.original;
                const quantity = item.isReplaced && !!item.replacement ? item.replacement.quantity : item.quantity;
                const productId = item.productId;
                if (isInEditMode && productId) {
                  return (
                    <div className="bp-product_item_card__quantity_actions">
                      <Button
                        variant="outline-primary"
                        className="bp-product_item_card__action_button"
                        size="sm"
                        disabled={quantity <= 1}
                        onClick={() => {
                          updateQuantity(productId, quantity - 1);
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
                          updateQuantity(productId, quantity + 1);
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
                const item = cell.row.original;
                const expiryDate = item.isReplaced && item.replacement ? item.replacement.expiryDate : item.expiryDate;
                const canExpire = item.isReplaced && item.replacement ? item.replacement.product?.canExpire : item.product?.canExpire;
                const productId = cell.row.original.productId;
                if (isInEditMode) {
                  return canExpire ? (
                    <Form.Control
                      type="date"
                      value={dayjs(expiryDate).format("YYYY-MM-DD")}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        if (productId) {
                          updateExpiryDate(productId, newDate);
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
              header: "Attributes",
              cell: (cell) => {
                const isExtra = cell.row.original.isExtra;
                const isReplacement = !!cell.row.original.replacement;

                return (
                  <div>
                    {isExtra && <Pill className="bp-mark_shopping_items_table__status_pill extra">Extra</Pill>}

                    {isReplacement && <Pill className="bp-mark_shopping_items_table__status_pill replacement">Replacement</Pill>}
                  </div>
                );
              },
            },

            {
              header: "Actions",
              cell: (cell) => {
                const item = cell.row.original;
                const product = item.product;
                const productId = item.productId;

                const isCancelled = item.isReplaced && !!item.replacement ? item.replacement.isCancelled : item.isCancelled;
                const isOriginal = productId ? getIsItemOriginal(productId) : false;
                const isExtra = cell.row.original.isExtra;
                if (!isInEditMode) {
                  return null;
                }
                return (
                  <div className="bp-mark_shopping_items_table__actions">
                    {!isCancelled && !isExtra && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          if (productId) {
                            cancelShoppingItem(productId);
                          }
                        }}
                      >
                        <FaTrash />
                        &emsp;Cancel item
                      </Button>
                    )}
                    {isCancelled && !isExtra && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          if (productId) {
                            uncancelShoppingItem(productId);
                          }
                        }}
                      >
                        <FaTrashRestore />
                        &emsp;Restore item
                      </Button>
                    )}
                    {!isCancelled && !isExtra && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          if (product) {
                            showReplacementOffcanvas(product);
                          }
                        }}
                      >
                        <MdFindReplace />
                        &emsp;Replace item
                      </Button>
                    )}
                    {!isOriginal && !isExtra && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          if (productId) {
                            resetItemToOriginal(productId);
                          }
                        }}
                      >
                        <RxReset />
                        &emsp;Reset all
                      </Button>
                    )}
                    {isExtra && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          if (productId) {
                            removeExtraShoppingItem(productId);
                          }
                        }}
                      >
                        <FaTrashCan />
                        &emsp;Remove item
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
