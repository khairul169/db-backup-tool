import { SelectOption } from "@/components/ui/select";
import { CreateServerSchema } from "@backend/schemas/server.schema";

export const connectionTypes: SelectOption[] = [
  {
    label: "PostgreSQL",
    value: "postgres",
  },
];

export const initialServerData: CreateServerSchema = {
  name: "",
  connection: {
    type: "postgres",
    host: "localhost",
    port: 5432,
    user: "postgres",
    pass: "",
  },
  databases: [],
};
