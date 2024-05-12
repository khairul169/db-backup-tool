import { SelectOption } from "@/components/ui/select";
import { createServerSchema } from "@backend/schemas/server.schema";
import { z } from "zod";

export const connectionTypes: SelectOption[] = [
  {
    label: "PostgreSQL",
    value: "postgres",
  },
];

export const serverFormSchema = createServerSchema.merge(
  z.object({
    id: z.string().nanoid().optional().nullable(),
  })
);

export type ServerFormSchema = z.infer<typeof serverFormSchema>;

export const initialServerData: ServerFormSchema = {
  name: "",
  connection: {
    type: "postgres",
    host: "localhost",
    port: 5432,
    user: "postgres",
    pass: "",
  },
  databases: [],
  backup: {
    compress: true,
    scheduled: false,
    every: 1,
    interval: "day",
    time: "01:00",
    day: 0,
    month: 0,
  },
};
