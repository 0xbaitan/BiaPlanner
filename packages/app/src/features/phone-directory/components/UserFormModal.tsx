import usePhoneDirectoryState, {
  useSetUserFormModalOpenState,
} from "../hooks/usePhoneDirectoryState";

import Modal from "react-bootstrap/Modal";
import UserForm from "./UserForm";

export default function UserFormModal() {
  const { isUserFormModalOpen } = usePhoneDirectoryState();
  const setModalOpenState = useSetUserFormModalOpenState();

  return (
    <Modal show={isUserFormModalOpen} onHide={() => setModalOpenState(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UserForm />
      </Modal.Body>
    </Modal>
  );
}
