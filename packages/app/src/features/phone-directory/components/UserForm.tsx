import { Formik, FormikHelpers } from "formik";
import { useAddUserQuery, useLazyAddUserQuery } from "@/apis/UsersApi";

import { User } from "@biaplanner/shared";

export default function UserForm() {
  const [addUser] = useLazyAddUserQuery();
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
        const { isError, data } = await addUser(values);
        if (isError) {
          throw new Error("Failed to add user");
        }
        if (!data) {
          throw new Error("No data returned");
        }
        return data;
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <input
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
          />
          <input
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
          />
          <input
            name="dateOfBirth"
            value={values.dateOfBirth.toISOString()}
            onChange={handleChange}
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );
}
