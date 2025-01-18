import { AxiosError } from "axios";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

import { ValidationErrorData } from "./types/utils";
import { toastGenericError } from "./utils";

export const errorMap: z.ZodErrorMap = (error, ctx) => {
  switch (error.code) {
    case z.ZodIssueCode.too_small:
      if (error.type === "string") {
        return { message: `Must be at least ${error.minimum} characters` };
      } else if (error.type === "number") {
        return { message: `Must be at least ${error.minimum}` };
      }
      break;
    case z.ZodIssueCode.too_big:
      if (error.type === "string") {
        return {
          message: `Must be no longer than ${error.maximum} characters`,
        };
      } else if (error.type === "number") {
        return { message: `Must be less than ${error.maximum}` };
      }
      break;
  }

  return { message: ctx.defaultError };
};

export function handleMutationError<T extends FieldValues>(
  error: AxiosError<ValidationErrorData<T>>,
  form: ReturnType<typeof useForm<T>>,
) {
  if (error.response?.data.errors) {
    setFormErrors(error.response.data, form);
  } else {
    toastGenericError();
  }
}

export function setFormErrors<T extends FieldValues>(
  errors: ValidationErrorData<T>,
  form: ReturnType<typeof useForm<T>>,
) {
  for (const key in errors.errors) {
    const fieldErrors = errors.errors[key];
    for (const message of fieldErrors) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      form.setError(key as any, { type: "manual", message });
    }
  }
}
