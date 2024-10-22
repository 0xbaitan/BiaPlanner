import usePhoneDirectoryState, {
  useSetActivePhoneEntry,
  useSetShowPhoneEntryDeletionWarning,
} from "../hooks/usePhoneDirectoryState";

import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import { set } from "react-hook-form";
import { useCallback } from "react";
import { useDeletePhoneEntryMutation } from "@/apis/PhoneEntriesApi";

export default function PhoneEntryDeletionWarningModal() {
  const { showPhoneEntryDeletionWarning, activePhoneEntry } =
    usePhoneDirectoryState();
  const setShowPhoneEntryDeletionWarning =
    useSetShowPhoneEntryDeletionWarning();
  const [deletePhoneEntry] = useDeletePhoneEntryMutation();
  const setActivePhoneEntry = useSetActivePhoneEntry();

  const handleDeletePhoneEntry = useCallback(() => {
    console.log("activePhoneEntry", activePhoneEntry);
    if (activePhoneEntry && activePhoneEntry.id) {
      deletePhoneEntry(Number(activePhoneEntry.id));
    }
    setShowPhoneEntryDeletionWarning(false);
    setActivePhoneEntry(undefined);
  }, [activePhoneEntry, deletePhoneEntry, setActivePhoneEntry]);
  return (
    <Modal
      show={showPhoneEntryDeletionWarning}
      onHide={() => setShowPhoneEntryDeletionWarning(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Phone Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this phone number (
        {activePhoneEntry?.phoneNumber ?? "N/A"}) belonging to{" "}
        {activePhoneEntry?.user?.firstName} {activePhoneEntry?.user?.lastName}?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setShowPhoneEntryDeletionWarning(false)}
        >
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeletePhoneEntry}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
