import api from "@/lib/api";
import type { InferResponseType } from "hono/client";

const getServerById = api.servers[":id"].$get;
export type GetServerResult = NonNullable<
  InferResponseType<typeof getServerById>
>;
