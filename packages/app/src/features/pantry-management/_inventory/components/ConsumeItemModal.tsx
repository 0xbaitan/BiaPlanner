import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface ConsumeItemModalProps {
  visible: boolean;
  onClose: () => void;
  onConsume: (item: string, amount: number, unit: string) => void;
  pantryItems: { id: string; name: string }[];
}

export default function ConsumeItemModal({ visible, onClose, onConsume, pantryItems }: ConsumeItemModalProps) {
  const [selectedItem, setSelectedItem] = useState<string | undefined>();
  const [amount, setAmount] = useState<number | undefined>();
  const [unit, setUnit] = useState<string>("grams");

  const handleConsume = () => {
    if (selectedItem && amount) {
      onConsume(selectedItem, amount, unit);
      onClose();
    }
  };

  return (
    <Modal show={visible} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Consume Pantry Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="selectItem" className="form-label">
              Select Item
            </label>
            <select id="selectItem" className="form-select" onChange={(e) => setSelectedItem(e.target.value)}>
              <option value="">Select a pantry item</option>
              {pantryItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input type="number" id="amount" className="form-control" placeholder="Enter amount" onChange={(e) => setAmount(Number(e.target.value))} />
          </div>
          <div className="mb-3">
            <label htmlFor="unit" className="form-label">
              Unit
            </label>
            <select id="unit" className="form-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="grams">Grams</option>
              <option value="ml">Milliliters</option>
              <option value="pieces">Pieces</option>
            </select>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConsume} disabled={!selectedItem || !amount}>
          Consume
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
