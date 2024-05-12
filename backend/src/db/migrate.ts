import fs from "fs";
import { migrate as migrator } from "drizzle-orm/bun-sqlite/migrator";
import { DATABASE_PATH } from "../consts";
import db, { sqlite } from ".";
import { seed } from "./seed";

const initializeData = !fs.existsSync(DATABASE_PATH);

const migrate = async () => {
  migrator(db, {
    migrationsFolder: __dirname + "/migrations",
  });

  if (initializeData) {
    await seed();
  }

  sqlite.close();
};

migrate();
