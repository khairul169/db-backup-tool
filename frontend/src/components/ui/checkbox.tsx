import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { FormControl } from "./form";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { Label } from "./label";

type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
>;

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-slate-200 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50 dark:border-slate-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:data-[state=checked]:bg-slate-50 dark:data-[state=checked]:text-slate-900",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

type CheckboxFieldProps<TValues extends FieldValues> = Omit<
  CheckboxProps,
  "form"
> & {
  form: UseFormReturn<TValues>;
  name: FieldPath<TValues>;
  label?: string;
  fieldClassName?: string;
};

const CheckboxField = <TValues extends FieldValues>({
  form,
  name,
  label,
  fieldClassName,
  className,
  ...props
}: CheckboxFieldProps<TValues>) => {
  return (
    <FormControl
      form={form}
      name={name}
      className={className}
      render={({ field, id }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            id={id}
            className={fieldClassName}
            {...field}
            checked={field.value}
            onCheckedChange={field.onChange}
            {...props}
          />

          {label ? (
            <Label htmlFor={id} className="cursor-pointer">
              {label}
            </Label>
          ) : null}
        </div>
      )}
    />
  );
};

export default CheckboxField;

export { Checkbox };
