import { FormProvider, useForm } from "react-hook-form";
import { ICreateRequestUserDto, IValidationError } from "@biaplanner/shared";
import { ZodType, z } from "zod";
import { useCallback, useMemo } from "react";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import dayjs from "dayjs";
import { useRegisterUserMutation } from "@/apis/AuthenticationApi";
import useValidationErrors from "@/features/authentication/hooks/useValidationErrors";
import { zodResolver } from "@hookform/resolvers/zod";

export type SignUpFormData = Omit<ICreateRequestUserDto, "id"> & {
  confirmPassword: string;
};

export type SignUpFormProps = {
  initialValues?: SignUpFormData;
};

export const SignUpFormValidationSchema: ZodType<SignUpFormData> = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    username: z
      .string()
      .min(1, { message: "Username is required" })
      .regex(/^[a-zA-Z][a-zA-Z0-9._-]{1,18}$/, {
        message:
          "Username must start with a letter and can contain only \
        alphabets, numbers, dashes, periods and underscores",
      })
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(20, { message: "Username must be at most 20 characters long" }),
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
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(255, { message: "Password must be at most 255 characters long" })
      .regex(/(?=.*[a-z])/, { message: "Password must contain at least one lowercase letter" })
      .regex(/(?=.*[A-Z])/, { message: "Password must contain at least one uppercase letter" })
      .regex(/(?=.*\d)/, { message: "Password must contain at least one number" })
      .regex(/(?=.*\W)/, { message: "Password must contain at least one symbol" })
      .refine(
        (password) => {
          return !password.includes(" ");
        },
        { message: "Password cannot contain spaces" }
      ),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export default function SignUpForm(props: SignUpFormProps) {
  const { initialValues } = props;
  const methods = useForm<SignUpFormData>({
    defaultValues: initialValues ?? {
      dateOfBirth: dayjs().format("YYYY-MM-DD"),
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      username: "",
      confirmPassword: "",
    },
    resolver: zodResolver(SignUpFormValidationSchema),
  });

  const [registerUser, { isError, error }] = useRegisterUserMutation();
  const validationErrorsResponse = useValidationErrors(isError, error);

  const nonUniqueEmailError = validationErrorsResponse?.containsConstraint("email", "isUnique") ? "Email is already in use" : undefined;
  const nonUniqueUsernameError = validationErrorsResponse?.containsConstraint("username", "isUnique") ? "Username is already in use" : undefined;
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = methods;

  const onSubmit = useCallback(async (values: SignUpFormData) => {
    const { confirmPassword, ...user } = values;
    const registeredUser = await registerUser(user).unwrap();
    console.log(registeredUser);
  }, []);

  return (
    <FormProvider {...methods}>
      <Form id="bp-sign-up-form" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="bp-first-name">
          <Form.Label>First Name</Form.Label>
          <Form.Control form="bp-sign-up-form" {...register("firstName")} />
          {errors.firstName && <Form.Text className="+error">{errors.firstName.message}</Form.Text>}
        </Form.Group>
        <Form.Group controlId="bp-last-name">
          <Form.Label>Last Name</Form.Label>
          <Form.Control form="bp-sign-up-form" {...register("lastName")} />
          {errors.lastName && <Form.Text className="+error">{errors.lastName.message}</Form.Text>}
        </Form.Group>
        <Form.Group controlId="bp-username">
          <Form.Label>Username</Form.Label>
          <Form.Control form="bp-sign-up-form" {...register("username")} />
          {errors.username && <Form.Text className="+error">{errors.username.message}</Form.Text>}
          {nonUniqueUsernameError && <Form.Text className="+error">{nonUniqueUsernameError}</Form.Text>}
        </Form.Group>
        <Form.Group controlId="bp-date-of-birth">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control form="bp-sign-up-form" {...register("dateOfBirth")} type="date" />
          {errors.dateOfBirth && <Form.Text className="+error">{errors.dateOfBirth.message}</Form.Text>}
        </Form.Group>
        <Form.Group controlId="bp-email">
          <Form.Label>Email</Form.Label>
          <Form.Control form="bp-sign-up-form" {...register("email")} type="email" />
          {errors.email && <Form.Text className="+error">{errors.email.message}</Form.Text>}
          {nonUniqueEmailError && <Form.Text className="+error">{nonUniqueEmailError}</Form.Text>}
        </Form.Group>
        <Form.Group controlId="bp-password">
          <Form.Label>Password</Form.Label>
          <Form.Control form="bp-sign-up-form" {...register("password")} type="password" />
          {errors.password && <Form.Text className="+error">{errors.password.message}</Form.Text>}
        </Form.Group>
        <Form.Group controlId="bp-confirm-password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control form="bp-sign-up-form" {...register("confirmPassword")} type="password" />
          {errors.confirmPassword && <Form.Text className="+error">{errors.confirmPassword.message}</Form.Text>}
        </Form.Group>
        <Button type="submit" form="bp-sign-up-form">
          Sign Up
        </Button>
      </Form>
    </FormProvider>
  );
}
