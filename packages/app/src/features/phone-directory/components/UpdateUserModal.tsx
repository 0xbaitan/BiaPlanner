import UserForm, { UserFormData } from "./UserForm";
import { useCallback, useMemo } from "react";
import usePhoneDirectoryState, {
  useSetActiveUser,
  useSetShowUpdateUserForm,
} from "../hooks/usePhoneDirectoryState";

import Modal from "react-bootstrap/Modal";
import convertToUserFormData from "../util/convertToUserFormData";

export default function UpdateUserModal() {
  const { activeUser, showUpdateUserForm } = usePhoneDirectoryState();
  const userFormData: UserFormData | undefined = useMemo(() => {
    if (!activeUser) return undefined;
    return convertToUserFormData(activeUser);
  }, [activeUser]);
  const setShowUpdateUserModal = useSetShowUpdateUserForm();
  const setActiveUser = useSetActiveUser();
  const handleClose = useCallback(() => {
    setShowUpdateUserModal(false);
    setActiveUser(undefined);
  }, [setShowUpdateUserModal, setActiveUser]);

  return (
    <Modal show={showUpdateUserForm} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UserForm initialValues={userFormData} submitType="update" />
      </Modal.Body>
    </Modal>
  );
}
