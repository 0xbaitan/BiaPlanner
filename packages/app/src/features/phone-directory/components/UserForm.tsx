import { Formik, FormikHelpers } from "formik";
import { useAddUserMutation, useGetUsersQuery } from "@/apis/UsersApi";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserDto } from "@biaplanner/shared";
import dayjs from "dayjs";
import { useSetUserFormModalOpenState } from "../hooks/usePhoneDirectoryState";

export default function UserForm() {
  const [addUser] = useAddUserMutation();
  const { refetch: refetchUsers } = useGetUsersQuery();
  const setModalOpenState = useSetUserFormModalOpenState();
  return (
    <Formik<UserDto>
      initialValues={{
        firstName: "",
        lastName: "",
        dateOfBirth: dayjs().toISOString(),
        phoneEntries: [],
      }}
      onSubmit={async (
        values: UserDto,
        formikHelpers: FormikHelpers<UserDto>
      ): Promise<UserDto> => {
        const { data, error } = await addUser(values);
        if (error) {
          throw new Error("Failed to add user");
        }
        if (!data) {
          throw new Error("No data returned");
        }
        return data;
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <Form
          onSubmit={async (e) => {
            handleSubmit(e);
            await refetchUsers();
            setModalOpenState(false);
          }}
          className="d-flex flex-column"
        >
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              name="firstName"
              placeholder="e.g. John"
              value={values.firstName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              name="lastName"
              placeholder="e.g. Doe"
              value={values.lastName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              name="dateOfBirth"
              value={values.dateOfBirth}
              type="date"
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
}
