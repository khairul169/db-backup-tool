import type { DatabaseConfig } from "@/types/database.types";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const userModel = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const serverModel = sqliteTable("servers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  type: text("type", { enum: ["postgres"] }).notNull(),
  connection: text("connection"),
  ssh: text("ssh"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const databaseModel = sqliteTable("databases", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  serverId: text("server_id")
    .references(() => serverModel.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  name: text("name").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  lastBackupAt: text("last_backup_at"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
