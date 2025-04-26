import "../styles/ShoppingListItemCardList.scss";

import { IWriteShoppingItemDto, IWriteShoppingListDto, WriteShoppingListItemSchema } from "@biaplanner/shared";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useShoppingListItemsActions, useShoppingListItemsState } from "../reducers/ShoppingListItemsReducer";

import BrowseProductsOffcanvas from "./BrowseProductsOffcanvas";
import ShoppingListItemCard from "./ShoppingListItemCard";
import { useCallback } from "react";

export default function ShoppingListItemCardList() {
  const formMethods = useFormContext<IWriteShoppingListDto>();
  const { hideOffcanvas } = useShoppingListItemsActions();
  const { showOffcanvas: isOffcanvasShown } = useShoppingListItemsState();

  const { fields, append, remove, update } = useFieldArray({
    name: "items",
    control: formMethods.control,
    keyName: "fieldId",
  });

  const addItemToShoppingList = useCallback(
    (item: IWriteShoppingItemDto) => {
      append(WriteShoppingListItemSchema.parse(item));
    },
    [append]
  );

  const removeItemFromShoppingList = useCallback(
    (productId: string) => {
      const index = fields.findIndex((item) => item.productId === productId);
      if (index !== -1) {
        remove(index);
      }
    },
    [fields, remove]
  );

  const updateItemInShoppingList = useCallback(
    (item: IWriteShoppingItemDto) => {
      const index = fields.findIndex((field) => field.productId === item.productId);
      if (index !== -1) {
        update(index, WriteShoppingListItemSchema.parse(item));
      }
    },
    [fields, update]
  );

  const getItemInShoppingList = useCallback(
    (productId: string) => {
      const index = fields.findIndex((item) => item.productId === productId);
      if (index !== -1) {
        return fields[index];
      }
      return null;
    },
    [fields]
  );

  const isPresentInList = useCallback(
    (productId: string) => {
      return fields.some((item) => item.productId === productId);
    },
    [fields]
  );

  return (
    <div className="bp-shopping_list_item_card_list_container">
      <BrowseProductsOffcanvas
        showOffcanvas={isOffcanvasShown}
        hideOffcanvas={hideOffcanvas}
        type="normal"
        replacedProductName={undefined}
        shoppingListItemFunctions={{
          addItemToShoppingList,
          removeItemFromShoppingList,
          updateItemInShoppingList,
          getItemInShoppingList,
          isPresentInList,
        }}
      />

      <ul className="bp-shopping_list_item_card_list">
        {fields.map((item, index) => (
          <li key={item.fieldId} className="bp-shopping_list_item_card_list__item">
            <ShoppingListItemCard
              key={item.fieldId}
              value={item}
              onRemove={() => {
                remove(index);
              }}
              onUpdate={(value) => {
                update(index, value);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
