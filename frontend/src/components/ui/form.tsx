import FormContext from "@/context/form-context";
import { cn } from "@/lib/utils";
import React, { useId } from "react";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormReturn,
  UseFormStateReturn,
} from "react-hook-form";

type FormProps<T extends FieldValues> =
  React.ComponentPropsWithoutRef<"form"> & {
    form: UseFormReturn<T>;
  };

const Form = <T extends FieldValues>({ form, ...props }: FormProps<T>) => {
  return (
    <FormContext.Provider value={form as never}>
      <form {...props} />
    </FormContext.Provider>
  );
};

type FormControlRenderFn<
  T extends FieldValues,
  FieldName extends FieldPath<T>
> = ({
  field,
  fieldState,
  formState,
}: {
  field: ControllerRenderProps<T, FieldName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<T>;
  id: string;
}) => React.ReactElement;

export type FormControlProps<
  TValues extends FieldValues,
  TName extends FieldPath<TValues> = FieldPath<TValues>
> = {
  form: UseFormReturn<TValues>;
  name: TName;
  render: FormControlRenderFn<TValues, TName>;
  className?: string;
  label?: string;
};

export const FormControl = <T extends FieldValues>({
  form,
  name,
  render,
  className,
  label,
}: FormControlProps<T>) => {
  const fieldId = useId();

  return (
    <Controller
      control={form.control}
      name={name}
      render={(props) => {
        const { fieldState } = props;

        return (
          <div className={cn("space-y-1", className)}>
            {label != null && (
              <label htmlFor={fieldId} className="text-sm">
                {label}
              </label>
            )}

            {render({ ...props, id: fieldId })}

            {fieldState.error != null && (
              <p
                className="text-red-500 text-xs truncate"
                title={fieldState.error.message}
              >
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

export default Form;
