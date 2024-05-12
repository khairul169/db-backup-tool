import { ClientResponse, hc } from "hono/client";
import type { AppRouter } from "@backend/routers";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const api = hc<AppRouter>(BACKEND_URL || "http://localhost:3000/");

export const parseJson = async <T>(res: ClientResponse<T>) => {
  const json = await res.json();
  if (!res.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error((json as any)?.message || "An error occured.");
  }
  return json as T;
};

export default api;
