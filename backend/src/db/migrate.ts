import fs from "fs";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { DATABASE_PATH } from "@/consts";
import db, { sqlite } from ".";
import { seed } from "./seed";

const initializeData = fs.existsSync(DATABASE_PATH);

await migrate(db, {
  migrationsFolder: __dirname + "/migrations",
});

if (initializeData) {
  await seed();
}

await sqlite.close();
