import Table from "react-bootstrap/Table";

export default function PhoneDirectoryTable() {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th># </th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Phone Number</th>
        </tr>
        <tbody></tbody>
      </thead>
    </Table>
  );
}
