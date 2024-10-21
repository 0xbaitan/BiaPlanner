import "react-phone-input-2/lib/style.css";

import { Formik, FormikHelpers } from "formik";
import { PhoneEntry, UserDto } from "@biaplanner/shared";
import { useAddUserMutation, useGetUsersQuery } from "@/apis/UsersApi";
import { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PhoneInput from "react-phone-input-2";
import { convertToPhoneEntry } from "../util/convertToPhoneEntry";
import dayjs from "dayjs";
import { parsePhoneNumber } from "awesome-phonenumber";
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
        phoneEntries: [
          {
            countryCallingCode: "",
            countryCode: "",
            phoneNumber: "",
            isForHome: false,
            isForWork: false,
            isLandline: false,
            isMobile: true,
          },
        ],
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
      {({ values, handleChange, handleSubmit, setFieldValue }) => (
        <Form
          onSubmit={async (e) => {
            console.log(values);
            handleSubmit(e);
            await refetchUsers();
            setModalOpenState(false);
          }}
          id="user-form"
          className="d-flex flex-column"
        >
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              name="firstName"
              placeholder="e.g. John"
              value={values.firstName}
              onChange={handleChange}
              required
              form="user-form"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              name="lastName"
              placeholder="e.g. Doe"
              value={values.lastName}
              onChange={handleChange}
              required
              form="user-form"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              name="dateOfBirth"
              value={values.dateOfBirth}
              required
              type="date"
              onChange={handleChange}
              form="user-form"
            />
          </Form.Group>
          <div>
            <MobileNumberField
              values={values}
              handleChange={handleChange}
              index={0}
              setFieldValue={setFieldValue}
            />
          </div>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
}

// function MobileNumberField() {
//   // props: { values: UserDto, handleChange: React.ChangeEventHandler<PhoneEntry>, index: number }
//   // const { values, handleChange } = props;
//   const [value, setValue] = useState<Value>();
//   if (value) {
//     console.log(parsePhoneNumber(value));
//   }

//   return (
//     <Form.Group>
//       <Form.Label>Mobile Number</Form.Label>
//       <PhoneInput
//         defaultCountry={"GB"}
//         international={true}
//         value={value}
//         onChange={(value) => setValue(value)}
//       />
//     </Form.Group>
//   );
// }

function MobileNumberField(props: {
  values: UserDto;
  handleChange: React.ChangeEventHandler<PhoneEntry>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  index: number;
}) {
  const { values, handleChange, index, setFieldValue } = props;
  console.log(values);
  const currentPhoneEntry = values?.phoneEntries?.at(index);
  const [phoneNumberText, setPhoneNumberText] = useState<string | undefined>(
    currentPhoneEntry?.phoneNumber
  );
  const [phoneEntry, setPhoneEntry] = useState<PhoneEntry | undefined>(
    currentPhoneEntry
  );

  useEffect(() => {
    if (phoneNumberText) {
      const [parsedPhoneEntry, errorCode] =
        convertToPhoneEntry(phoneNumberText);
      console.log(errorCode);
      if (errorCode || !parsedPhoneEntry) {
        return;
      } else {
        setFieldValue(`phoneEntries[${index}]`, parsedPhoneEntry);
      }
    }
  }, [phoneNumberText]);
  return (
    <Form.Group>
      <Form.Label>Mobile Number</Form.Label>
      <input
        hidden
        type="text"
        name={`phoneEntries[${index}].countryCallingCode`}
        value={phoneEntry?.countryCallingCode}
        form="user-form"
        disabled
      />
      <input
        hidden
        type="text"
        name={`phoneEntries[${index}].countryCode`}
        value={phoneEntry?.countryCode}
        form="user-form"
        disabled
      />
      <input
        hidden
        type="text"
        name={`phoneEntries[${index}].phoneNumber`}
        value={phoneEntry?.phoneNumber}
        disabled
      />
      <PhoneInput
        inputProps={{
          name: "phoneNumber",
          required: true,
          placeholder: "e.g. +44 1234 567890",
          type: "tel",
        }}
        autocompleteSearch
        value={phoneNumberText}
        onChange={(value, data, e) => setPhoneNumberText(value)}
      />
    </Form.Group>
  );
}
