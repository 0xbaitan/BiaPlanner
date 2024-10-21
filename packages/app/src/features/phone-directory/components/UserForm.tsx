import "react-phone-input-2/lib/style.css";

import {
  FieldErrors,
  FormProvider,
  UseFormRegister,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { PhoneEntry, UserDto } from "@biaplanner/shared";
import { ZodType, z } from "zod";
import { useCallback, useMemo, useState } from "react";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import PhoneInput from "react-phone-input-2";
import { convertToPhoneEntry } from "../util/convertToPhoneEntry";
import dayjs from "dayjs";
import { useAddUserMutation } from "@/apis/UsersApi";
import { useSetUserFormModalOpenState } from "../hooks/usePhoneDirectoryState";
import { zodResolver } from "@hookform/resolvers/zod";

export type UserFormData = Omit<UserDto, "phoneEntries"> & {
  phoneEntries: { phoneNumber: string }[];
};

export const UserFormValidationSchema: ZodType<UserFormData> = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  phoneEntries: z
    .array(
      z.object({
        phoneNumber: z
          .string()
          .min(1, { message: "Phone number is required" })
          .refine(
            (phoneNumber) => {
              const [, error] = convertToPhoneEntry(phoneNumber);
              return !error;
            },
            { message: "Invalid phone number" }
          ),
      })
    )
    .min(1, { message: "At least one phone number is required" }),
});
export default function UserForm() {
  const [addUser] = useAddUserMutation();

  const setModalOpenState = useSetUserFormModalOpenState();

  const methods = useForm<UserFormData>({
    defaultValues: {
      dateOfBirth: dayjs().format("YYYY-MM-DD"),
      firstName: "",
      lastName: "",
      phoneEntries: [
        {
          phoneNumber: "",
        },
      ],
    },
    resolver: zodResolver(UserFormValidationSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setError,
    getValues,
  } = methods;

  const onSubmit = useCallback(
    async (data: UserFormData) => {
      try {
        const { phoneEntries, ...rest } = data;
        const phoneEntriesParsed = phoneEntries.map((entry) => {
          const [parsedEntry] = convertToPhoneEntry(entry.phoneNumber);
          return parsedEntry;
        }) as PhoneEntry[];
        const user: UserDto = {
          ...rest,
          phoneEntries: phoneEntriesParsed,
        };
        await addUser(user);
        setModalOpenState(false);
      } catch (error) {
        throw error;
      }
    },
    [addUser, setModalOpenState]
  );
  const { fields, append, remove } = useFieldArray({
    control,
    name: "phoneEntries",
  });

  const mobileNumberFields = useMemo(() => {
    {
      return fields.map((field, index) => (
        <MobileNumberField key={field.id} index={index} />
      ));
    }
  }, [fields, register, setError, errors]);

  return (
    <FormProvider {...methods}>
      <Button
        onClick={() =>
          console.log(
            getValues()
              .phoneEntries.map((entry) => entry.phoneNumber)
              .join(",")
          )
        }
      >
        Get Values
      </Button>
      <Form id="user-form" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            {...register("firstName", { required: true })}
          />
          {errors.firstName && (
            <Form.Text className="+error">{errors.firstName.message}</Form.Text>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            {...register("lastName", { required: true })}
          />
          {errors.lastName && (
            <Form.Text className="+error">{errors.lastName.message}</Form.Text>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            {...register("dateOfBirth", { required: true })}
          />
          {errors.dateOfBirth && (
            <Form.Text className="+error">
              {errors.dateOfBirth.message}
            </Form.Text>
          )}
        </Form.Group>
        {mobileNumberFields}
        <Button
          onClick={() => {
            append({ phoneNumber: "" });
          }}
        >
          Add Mobile Number
        </Button>
        <Button onClick={() => remove(fields.length - 1)}>
          Remove Mobile Number
        </Button>
        <Button type="submit">Submit</Button>
      </Form>
    </FormProvider>
  );
}

function MobileNumberField(props: { index: number }) {
  const { index } = props;

  const {
    formState: { errors },
    setValue,
  } = useFormContext<UserFormData>();

  const phoneEntryError = errors.phoneEntries?.[index]?.phoneNumber;

  const handleChange = (value: string | undefined) => {
    setValue(`phoneEntries.${index}.phoneNumber`, value ?? "");
  };

  return (
    <Form.Group>
      <Form.Label>Mobile Number</Form.Label>

      <PhoneInput
        inputProps={{
          placeholder: "e.g. +44 1234 567890",
          type: "tel",
        }}
        autocompleteSearch
        value={undefined}
        onChange={handleChange}
      />
      {phoneEntryError && (
        <Form.Text className="+error">{phoneEntryError.message}</Form.Text>
      )}
    </Form.Group>
  );
}
