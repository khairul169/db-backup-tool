import { createDisclosureStore } from "@/lib/disclosure";
import { initialServerData } from "../servers/schema";

export const serverFormDlg = createDisclosureStore(initialServerData);
