import { cn } from "@/lib/utils";
import React from "react";

const Card = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div className={cn("border rounded-lg bg-white", className)} {...props} />
  );
};

export default Card;
