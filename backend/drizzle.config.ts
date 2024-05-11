import { STORAGE_DIR } from "../consts";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  dbCredentials: {
    url: STORAGE_DIR + "/database.db",
  },
  schema: "./src/db/models.ts",
  out: "./src/db/migrations",
});
