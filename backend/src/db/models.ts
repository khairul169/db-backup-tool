import {
  relations,
  sql,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import type { ServerBackupSchema } from "../schemas/server.schema";

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
export type UserModel = InferSelectModel<typeof userModel>;

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
  backup: text("backup", { mode: "json" }).$type<ServerBackupSchema>(),
  nextBackup: text("next_backup"),
});
export type ServerModel = InferSelectModel<typeof serverModel>;

export const serverRelations = relations(serverModel, ({ many }) => ({
  databases: many(databaseModel),
}));

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
export type DatabaseModel = InferSelectModel<typeof databaseModel>;

export const databaseRelations = relations(databaseModel, ({ one }) => ({
  server: one(serverModel, {
    fields: [databaseModel.serverId],
    references: [serverModel.id],
  }),
}));

export const backupTypeEnum = ["backup", "restore"] as const;

export const backupStatusEnum = [
  "pending",
  "running",
  "success",
  "failed",
] as const;

export const backupModel = sqliteTable("backups", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  serverId: text("server_id")
    .references(() => serverModel.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  databaseId: text("database_id")
    .references(() => databaseModel.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  type: text("type", { enum: backupTypeEnum }).default("backup"),
  status: text("status", { enum: backupStatusEnum }).default("pending"),
  output: text("output"),
  key: text("key"),
  hash: text("hash"),
  size: integer("size"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type BackupModel = InferSelectModel<typeof backupModel>;
export type InsertBackupModel = InferInsertModel<typeof backupModel>;

export const backupRelations = relations(backupModel, ({ one }) => ({
  server: one(serverModel, {
    fields: [backupModel.serverId],
    references: [serverModel.id],
  }),
  database: one(databaseModel, {
    fields: [backupModel.databaseId],
    references: [databaseModel.id],
  }),
}));
