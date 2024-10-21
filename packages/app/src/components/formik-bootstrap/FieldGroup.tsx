import {
  FastField as FormikField,
  FastFieldProps as FormikFieldProps,
} from "formik";

import Form from "react-bootstrap/Form";
import { FormControlProps } from "react-bootstrap/FormControl";
import { FormGroupProps } from "react-bootstrap/esm/FormGroup";
import { JSONValue } from "@biaplanner/shared";

export type FieldProps<T extends JSONValue> = {
  forFormik: FormikFieldProps<T>;
  forControl?: Omit<FormControlProps, "id">;
  forGroup?: Omit<FormGroupProps, "id">;
  label?: string;
  id?: string;
};

export default function FieldGroup<T extends JSONValue>(props: FieldProps<T>) {
  const { forFormik, forControl, forGroup, label, id } = props;

  return (
    <FormikField {...forFormik}>
      {(props: FormikFieldProps<T>) => {
        const { field, form, meta } = props;
        return (
          <Form.Group id={id} {...forGroup}>
            {label && <Form.Label>{label}</Form.Label>}
            {/* <Form.Control {...forControl} value={field.value} /> */}
          </Form.Group>
        );
      }}
    </FormikField>
  );
}
