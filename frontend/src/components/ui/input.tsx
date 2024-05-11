import * as React from "react";

import { cn } from "@/lib/utils";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { FormControl } from "./form";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

type InputFieldProps<TValues extends FieldValues> = Omit<InputProps, "form"> & {
  form: UseFormReturn<TValues>;
  name: FieldPath<TValues>;
  label?: string;
};

const InputField = <T extends FieldValues>({
  form,
  name,
  label,
  className,
  ...props
}: InputFieldProps<T>) => (
  <FormControl
    form={form}
    name={name}
    label={label}
    className={className}
    render={({ field, id }) => <Input id={id} {...field} {...props} />}
  />
);
InputField.displayName = "InputField";

export { InputField };
export default Input;
