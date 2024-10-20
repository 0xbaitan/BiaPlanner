import { Formik, FormikHelpers } from "formik";
import { useAddUserMutation, useGetUsersQuery } from "@/apis/UsersApi";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { User } from "@biaplanner/shared";
import { useSetUserFormModalOpenState } from "../hooks/usePhoneDirectoryState";

export default function UserForm() {
  const [addUser] = useAddUserMutation();
  const { refetch: refetchUsers } = useGetUsersQuery();
  const setModalOpenState = useSetUserFormModalOpenState();
  return (
    <Formik<User>
      initialValues={{
        firstName: "",
        lastName: "",
        dateOfBirth: new Date(),
        phoneEntries: [],
      }}
      onSubmit={async (
        values: User,
        formikHelpers: FormikHelpers<User>
      ): Promise<User> => {
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
              value={values.dateOfBirth.toISOString()}
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
}
