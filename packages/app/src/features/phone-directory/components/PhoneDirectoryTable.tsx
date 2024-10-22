import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { PhoneEntry, User, UserDto } from "@biaplanner/shared";
import { Suspense, useCallback } from "react";
import { useSetActivePhoneEntry, useSetShowPhoneEntryDeletionWarning, useSetShowUpdateUserForm, useSetUserFormModalOpenState, useShowUpdateUserForm } from "../hooks/usePhoneDirectoryState";

import AddUserModal from "./AddUserModal";
import Button from "react-bootstrap/Button";
import { FaPlus } from "react-icons/fa";
import PhoneEntryDeletionWarningModal from "./PhoneEntryDeletionWarningModal";
import Table from "react-bootstrap/Table";
import UpdateUserModal from "./UpdateUserModal";
import UserForm from "./UserForm";
import dayjs from "dayjs";
import { useGetPhoneEntriesQuery } from "@/apis/PhoneEntriesApi";
import { useGetUsersQuery } from "@/apis/UsersApi";

export default function PhoneDirectoryTable() {
  const { data: phoneEntries, isLoading, isError } = useGetPhoneEntriesQuery();
  const setModalOpenState = useSetUserFormModalOpenState();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !phoneEntries || !Array.isArray(phoneEntries)) return <div>Error</div>;
  if (!phoneEntries) return <div>No data</div>;

  const rows = phoneEntries.map((item, i) => <TableRow key={i} index={i} phoneEntry={item} />);

  return (
    <div className="m-5">
      <AddUserModal />
      <PhoneEntryDeletionWarningModal />
      <UpdateUserModal />
      <Button onClick={() => setModalOpenState(true)}>
        <FaPlus />
        <span className="ms-2">Add new user</span>
      </Button>
      <div className="mt-4">
        <Suspense fallback={<div>Loading...</div>}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th># </th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Date of Birth</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Suspense>
      </div>
    </div>
  );
}

function TableRow(props: { phoneEntry: PhoneEntry; index: number }) {
  const { phoneEntry, index } = props;

  const showPhoneEntryDeletionWarning = useSetShowPhoneEntryDeletionWarning();
  const setActivePhoneEntry = useSetActivePhoneEntry();
  const showUpdateForm = useShowUpdateUserForm();
  const showDeleteModal = useCallback((phoneEntry: PhoneEntry) => {
    setActivePhoneEntry(phoneEntry);
    showPhoneEntryDeletionWarning(true);
  }, []);

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{phoneEntry.user?.firstName ?? "-"}</td>
      <td>{phoneEntry.user?.lastName ?? "-"}</td>
      <td>{dayjs(phoneEntry.user?.dateOfBirth).format("MMM D, YYYY")}</td>
      <td>{phoneEntry.phoneNumber}</td>
      <td>
        <div className="d-flex gap-3 justify-content-start">
          <Button size="sm" onClick={() => showUpdateForm(Number(phoneEntry.user?.id))}>
            <FaPencilAlt />
          </Button>
          <Button size="sm" onClick={() => showDeleteModal(phoneEntry)}>
            <FaTrash />
          </Button>
        </div>
      </td>
    </tr>
  );
}
