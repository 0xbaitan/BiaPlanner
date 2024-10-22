import "react-phone-input-2/lib/style.css";

import { FaMinusCircle, FaPlus, FaPlusCircle } from "react-icons/fa";
import { FieldErrors, FormProvider, UseFormRegister, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { PhoneEntry, UserDto } from "@biaplanner/shared";
import { ZodType, z } from "zod";
import { useAddUserMutation, useUpdateUserMutation } from "@/apis/UsersApi";
import { useCallback, useMemo, useState } from "react";
import { useSetShowUpdateUserForm, useSetUserFormModalOpenState } from "../hooks/usePhoneDirectoryState";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import PhoneInput from "react-phone-input-2";
import { convertToPhoneEntry } from "../util/convertToPhoneEntry";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";

export type UserFormData = Omit<UserDto, "phoneEntries"> & {
  phoneEntries: { phoneNumber: string; id?: number }[];
};

export type UserFormProps = {
  initialValues?: UserFormData;
  submitType: "add" | "update";
};

export const UserFormValidationSchema: ZodType<UserFormData> = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z
    .string()
    .min(1, { message: "Date of birth is required" })
    .refine(
      (dateString) => {
        return dayjs(dateString).isBefore(dayjs().add(1, "day"), "date");
      },
      {
        message: "Date of birth cannot be in the future",
      }
    ),
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

export default function UserForm(props: UserFormProps) {
  const { initialValues, submitType } = props;
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const setModalOpenState = useSetUserFormModalOpenState();
  const setShowUpdateForm = useSetShowUpdateUserForm();
  const methods = useForm<UserFormData>({
    defaultValues: initialValues ?? {
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

  const onSubmit = useCallback(async () => {
    const data = getValues();
    try {
      const { phoneEntries, ...rest } = data;
      const phoneEntriesParsed = phoneEntries.map((entry) => {
        const [parsedEntry] = convertToPhoneEntry(entry.phoneNumber, entry.id);
        return parsedEntry;
      }) as PhoneEntry[];
      const user: UserDto = {
        ...rest,
        phoneEntries: phoneEntriesParsed,
      };
      if (submitType === "add") {
        await addUser(user);
        setModalOpenState(false);
      } else {
        console.log(user);
        await updateUser({
          id: Number(user.id),
          user,
        });
        setShowUpdateForm(false);
      }
    } catch (error) {
      throw error;
    }
  }, [addUser, setModalOpenState]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "phoneEntries",
  });

  const mobileNumberFields = useMemo(() => {
    {
      return fields.map((field, index) => <MobileNumberField key={field.id} index={index} value={field.phoneNumber} />);
    }
  }, [fields, register, setError, errors]);

  return (
    <FormProvider {...methods}>
      <Form id="user-form" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" {...register("firstName", { required: true })} />
          {errors.firstName && <Form.Text className="+error">{errors.firstName.message}</Form.Text>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" {...register("lastName", { required: true })} />
          {errors.lastName && <Form.Text className="+error">{errors.lastName.message}</Form.Text>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control type="date" {...register("dateOfBirth", { required: true })} />
          {errors.dateOfBirth && <Form.Text className="+error">{errors.dateOfBirth.message}</Form.Text>}
        </Form.Group>
        <hr className="mt-4 mb-4" />
        <div className="d-flex flex-row gap-2 justify-content-center mb-5">
          <Button
            onClick={() => {
              append({ phoneNumber: "" });
            }}
          >
            <FaPlusCircle /> <span className="ps-2">Add Number</span>
          </Button>
          <Button onClick={() => remove(fields.length - 1)} disabled={getValues().phoneEntries.length <= (initialValues?.phoneEntries.length ?? 1)}>
            <FaMinusCircle />
            <span className="ps-2"> Remove Number</span>
          </Button>
        </div>

        <div className="d-flex flex-column gap-4 mb-5">{mobileNumberFields}</div>
        <Button className="w-100 text-center" type="submit">
          Submit
        </Button>
      </Form>
    </FormProvider>
  );
}

function MobileNumberField(props: { index: number; value: string | undefined }) {
  const { index, value } = props;

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
      <Form.Label>Mobile Number #{index + 1}</Form.Label>

      <PhoneInput
        inputProps={{
          placeholder: "e.g. +44 1234 567890",
          type: "tel",
          defaultValue: "+3432423",
        }}
        autocompleteSearch
        value={value}
        onChange={handleChange}
      />
      {phoneEntryError && <Form.Text className="+error">{phoneEntryError.message}</Form.Text>}
    </Form.Group>
  );
}
