import "../styles/MarkShoppingItemsTable.scss";

import { FaMinus, FaPlus, FaTrash, FaTrashRestore } from "react-icons/fa";
import { useMarkShoppingDoneActions, useMarkShoppingDoneState } from "../reducers/MarkShoppingDoneReducer";

import Button from "react-bootstrap/esm/Button";
import { CellContext } from "@tanstack/react-table";
import { FaTrashCan } from "react-icons/fa6";
import Form from "react-bootstrap/esm/Form";
import { IWriteShoppingItemExtendedDto } from "@biaplanner/shared";
import MarkShoppingItemCellProvider from "./MarkShoppingItemCellProvider";
import { MdFindReplace } from "react-icons/md";
import Pill from "@/components/Pill";
import { RxReset } from "react-icons/rx";
import TabbedViewsTable from "@/components/tables/TabbedViewsTable";
import dayjs from "dayjs";
import { getImagePath } from "@/util/imageFunctions";
import { useGetProduct } from "@/hooks";

export type MarkShoppingItemsTableProps = {
  data: IWriteShoppingItemExtendedDto[];
};

export default function MarkShoppingItemsTable(props: MarkShoppingItemsTableProps) {
  const { data } = props;
  const { isInEditMode } = useMarkShoppingDoneState();
  const { updateQuantity, updateExpiryDate } = useMarkShoppingDoneActions();

  const getProduct = useGetProduct();

  return (
    <TabbedViewsTable<IWriteShoppingItemExtendedDto>
      data={data}
      views={[
        {
          viewKey: "general-details",
          viewTitle: "Shopping Items",
          columnAccessorKeys: ["product", "quantity", "expiryDate"],
          default: true,
          columnDefs: [
            {
              header: "Product",
              cell: (cell) => (
                <MarkShoppingItemCellProvider cell={cell}>
                  {(cell, product) => (
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
                  )}
                </MarkShoppingItemCellProvider>
              ),
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

                return (
                  <div className="bp-mark_shopping_items_table__cell">
                    {isInEditMode && productId ? (
                      <div className="bp-product_item_card__quantity_actions">
                        <Button variant="outline-primary" className="bp-product_item_card__action_button" size="sm" disabled={quantity <= 1} onClick={() => updateQuantity(productId, quantity - 1)}>
                          <FaMinus />
                        </Button>
                        <span className="bp-product_item_card__quantity">{quantity ?? 1}</span>
                        <Button variant="primary" className="bp-product_item_card__action_button" size="sm" onClick={() => updateQuantity(productId, quantity + 1)}>
                          <FaPlus />
                        </Button>
                      </div>
                    ) : (
                      <div>{quantity}</div>
                    )}
                  </div>
                );
              },
              accessorKey: "quantity",
            },
            {
              header: "Expiry date",
              cell: (cell) => {
                const item = cell.row.original;
                const expiryDate = item.isReplaced && item.replacement ? item.replacement.expiryDate : item.expiryDate;
                const canExpire = item.isReplaced && item.replacement ? item.replacement.productId : item.productId;
                const productId = cell.row.original.productId;

                return (
                  <div className="bp-mark_shopping_items_table__cell">
                    {isInEditMode && canExpire && productId ? (
                      <Form.Control type="date" value={dayjs(expiryDate).format("YYYY-MM-DD")} onChange={(e) => updateExpiryDate(productId, e.target.value)} />
                    ) : !isInEditMode && canExpire ? (
                      <span>{dayjs(expiryDate).format("DD/MM/YYYY")}</span>
                    ) : (
                      <span>N/A</span>
                    )}
                  </div>
                );
              },
              accessorKey: "expiryDate",
            },
            {
              header: "Attributes",
              cell: (cell) => {
                const isExtra = cell.row.original.isExtra;
                const isReplacement = !!cell.row.original.replacement;

                return (
                  <div className="bp-mark_shopping_items_table__cell">
                    {isExtra && <Pill className="bp-mark_shopping_items_table__status_pill extra">Extra</Pill>}
                    {isReplacement && <Pill className="bp-mark_shopping_items_table__status_pill replacement">Replacement</Pill>}
                  </div>
                );
              },
            },
            {
              header: "Actions",
              cell: (cell) => <ActionCell cell={cell} />,
            },
          ],
        },
      ]}
    />
  );
}

type ActionCellProps = {
  cell: CellContext<IWriteShoppingItemExtendedDto, unknown>;
};

function ActionCell({ cell }: ActionCellProps) {
  const { isInEditMode } = useMarkShoppingDoneState();
  const { cancelShoppingItem, uncancelShoppingItem, getIsItemOriginal, resetItemToOriginal, removeExtraShoppingItem, showReplacementOffcanvas } = useMarkShoppingDoneActions();

  return (
    <MarkShoppingItemCellProvider cell={cell}>
      {(cell, product) => {
        const item = cell.row.original;
        const productId = item.productId;

        const isCancelled = item.isReplaced && !!item.replacement ? item.replacement.isCancelled : item.isCancelled;
        const isOriginal = productId ? getIsItemOriginal(productId) : false;
        const isExtra = item.isExtra;

        if (!isInEditMode) {
          return null;
        }

        return (
          <div className="bp-mark_shopping_items_table__cell">
            <div className="bp-mark_shopping_items_table__actions">
              {!isCancelled && !isExtra && (
                <Button variant="outline-danger" size="sm" onClick={() => productId && cancelShoppingItem(productId)}>
                  <FaTrash />
                  &emsp;Cancel item
                </Button>
              )}
              {isCancelled && !isExtra && (
                <Button variant="outline-secondary" size="sm" onClick={() => productId && uncancelShoppingItem(productId)}>
                  <FaTrashRestore />
                  &emsp;Restore item
                </Button>
              )}
              {!isCancelled && !isExtra && (
                <Button variant="outline-secondary" size="sm" onClick={() => product && showReplacementOffcanvas(product)}>
                  <MdFindReplace />
                  &emsp;Replace item
                </Button>
              )}
              {!isOriginal && !isExtra && (
                <Button variant="outline-secondary" size="sm" onClick={() => productId && resetItemToOriginal(productId)}>
                  <RxReset />
                  &emsp;Reset all
                </Button>
              )}
              {isExtra && (
                <Button variant="outline-danger" size="sm" onClick={() => productId && removeExtraShoppingItem(productId)}>
                  <FaTrashCan />
                  &emsp;Remove item
                </Button>
              )}
            </div>
          </div>
        );
      }}
    </MarkShoppingItemCellProvider>
  );
}
