import { createContext, useContext } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

const FormContext = createContext<UseFormReturn>(null!);

export const useFormContext = <T extends FieldValues>() => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context as UseFormReturn<T>;
};

export default FormContext;
