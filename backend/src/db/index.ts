import path from "path";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { DATABASE_PATH } from "../consts";
import { mkdir } from "../utility/utils";
import schema from "./schema";

// Create database directory if not exists
mkdir(path.dirname(DATABASE_PATH));

// Initialize database
const sqlite = new Database(DATABASE_PATH);
const db = drizzle(sqlite, { schema });

export { sqlite };
export default db;
