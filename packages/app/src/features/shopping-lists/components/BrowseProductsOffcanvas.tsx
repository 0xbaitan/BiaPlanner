import { useShoppingListItemsActions, useShoppingListItemsState } from "../reducers/ShoppingListItemsReducer";

import Offcanvas from "react-bootstrap/esm/Offcanvas";

export default function BrowseProductsOffcanvas() {
  const { showOffcanvas } = useShoppingListItemsState();
  const { hideOffcanvas } = useShoppingListItemsActions();
  return (
    <Offcanvas show={showOffcanvas} onHide={hideOffcanvas} backdrop="static" placement="end" scroll>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Browse Products</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div>Browse Products</div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
