import { User, UserDto } from "@biaplanner/shared";

import Button from "react-bootstrap/Button";
import { Suspense } from "react";
import Table from "react-bootstrap/Table";
import UserForm from "./UserForm";
import UserFormModal from "./UserFormModal";
import { useGetPhoneEntriesQuery } from "@/apis/PhoneEntriesApi";
import { useGetUsersQuery } from "@/apis/UsersApi";
import { useSetUserFormModalOpenState } from "../hooks/usePhoneDirectoryState";

export default function PhoneDirectoryTable() {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const setModalOpenState = useSetUserFormModalOpenState();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !users || !Array.isArray(users)) return <div>Error</div>;
  if (!users) return <div>No data</div>;

  const rows = users.map((user) => <TableRow key={user.id} user={user} />);

  return (
    <>
      <UserFormModal />
      <Button onClick={() => setModalOpenState(true)}>Show Modal</Button>
      <Suspense fallback={<div>Loading...</div>}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th># </th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Suspense>
    </>
  );
}

function TableRow(props: { user: UserDto }) {
  const { user } = props;
  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>d</td>
    </tr>
  );
}
