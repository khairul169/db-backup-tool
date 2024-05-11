import { cn } from "@/lib/utils";
import React from "react";

const SectionTitle = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"p">) => {
  return (
    <h3 className={cn("text-xl font-medium mt-6", className)} {...props} />
  );
};

export default SectionTitle;
