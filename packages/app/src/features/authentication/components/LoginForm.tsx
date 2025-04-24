import { FormProvider, useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { useCallback, useEffect } from "react";

import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import { ILoginUserDto } from "@biaplanner/shared";
import { toast } from "react-toastify";
import { useAuthenticationActions } from "../reducers/AuthenticationReducer";
import { useAuthenticationHookCallbacks } from "../hooks";
import { useLoginUserMutation } from "@/apis/AuthenticationApi";
import { useNavigate } from "react-router-dom";
import useValidationErrors from "@/features/authentication/hooks/useValidationErrors";
import { zodResolver } from "@hookform/resolvers/zod";

export type LoginFormData = Omit<ILoginUserDto, "id">;

export type LoginFormProps = {
  initialValues?: Partial<LoginFormData>;
};

export const LoginFormValidationSchema: ZodType<LoginFormData> = z.object({
  login: z.union([
    z
      .string()
      .min(1, {
        message: "Login is required",
      })
      .email({ message: "Invalid email" }),
    z
      .string()
      .min(1, { message: "Login is required" })
      .regex(/^[a-zA-Z][a-zA-Z0-9._-]{1,18}$/, {
        message:
          // eslint-disable-next-line no-multi-str
          "Username must start with a letter and can contain only \
        alphabets, numbers, dashes, periods and underscores",
      })
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(20, { message: "Username must be at most 20 characters long" }),
  ]),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function LoginForm(props: LoginFormProps) {
  const { initialValues } = props;
  const methods = useForm<LoginFormData>({
    defaultValues: initialValues ?? {
      login: "",
      password: "",
    },
    resolver: zodResolver(LoginFormValidationSchema),
  });

  const { navigateToLoginPage, navigateToHomePage } = useAuthenticationHookCallbacks();

  const { setAuthenticationState } = useAuthenticationActions();
  const [loginUser, { isError, error, isSuccess, isLoading, data: loginData }] = useLoginUserMutation();
  const validationErrorsResponse = useValidationErrors(isError, error);
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = methods;
  const navigate = useNavigate();
  const userDoesNotExistMessage = validationErrorsResponse?.containsConstraint("login", "userExists") ? "User of this email/username does not exist" : undefined;

  useEffect(() => {
    if (isSuccess) {
      toast.success(`You have successfully logged in as ${loginData?.user?.username}`);
    } else if (isLoading) {
      toast.info("Logging in...");
    } else if (isError) {
      if (validationErrorsResponse?.containsConstraint("login", "userExists")) {
        toast.error("User of this email/username does not exist");
      } else if (validationErrorsResponse?.containsConstraint("login", "password")) {
        toast.error("Invalid password");
      } else {
        toast.error("Login failed");
      }
    }
  }, [isError, isSuccess, isLoading, validationErrorsResponse, loginData]);

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      const { accessTokenObj, refreshTokenObj, user } = await loginUser(data).unwrap();
      if (accessTokenObj && refreshTokenObj && user) {
        setAuthenticationState(accessTokenObj, refreshTokenObj, user);
        navigateToHomePage();
      } else {
        setAuthenticationState(undefined, undefined, undefined);
        navigateToLoginPage();
      }
    },
    [loginUser, setAuthenticationState, navigateToHomePage, navigateToLoginPage]
  );

  return (
    <FormProvider {...methods}>
      <Form id="bp-login-form" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="bp-login">
          <Form.Label>Username/Email</Form.Label>
          <Form.Control isInvalid={!!errors.login || !!userDoesNotExistMessage} {...register("login")} type="text" />
          <Form.Control.Feedback type="invalid">{errors.login?.message || userDoesNotExistMessage}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="bp-password">
          <Form.Label>Password</Form.Label>
          <Form.Control isInvalid={!!errors.password} {...register("password")} type="password" />
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="bp-login-submit">
          <Button type="submit">Login</Button>
        </Form.Group>
      </Form>
    </FormProvider>
  );
}
