import Table from "react-bootstrap/Table";
import { useGetPhoneEntriesQuery } from "@/apis/PhoneEntriesApi";

export default function PhoneDirectoryTable() {

  const {data} = useGetPhoneEntriesQuery()
  console.log(data)
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
