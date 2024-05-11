import { createDisclosureStore } from "@/lib/disclosure";
import { initialServerData } from "../servers/schema";

export const addServerDlg = createDisclosureStore(initialServerData);
