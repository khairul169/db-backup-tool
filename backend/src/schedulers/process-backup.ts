import fs from "fs";
import path from "path";
import { and, asc, eq, sql } from "drizzle-orm";
import ServerService from "../services/server.service";
import db from "../db";
import { backupModel, databaseModel } from "../db/models";
import DatabaseUtil from "../lib/database-util";
import { BACKUP_DIR } from "../consts";
import { mkdir } from "../utility/utils";
import { hashFile } from "../utility/hash";

let isRunning = false;
const serverService = new ServerService();

const runBackup = async (task: PendingTasks[number]) => {
  try {
    await db
      .update(backupModel)
      .set({ status: "running" })
      .where(eq(backupModel.id, task.id));

    const server = serverService.parse(task.server);
    const dbName = task.database.name;
    const dbUtil = new DatabaseUtil(server.connection);

    if (task.type === "backup") {
      const key = path.join(server.connection.host, dbName, `${Date.now()}`);
      const outFile = path.join(BACKUP_DIR, key);
      mkdir(path.dirname(outFile));

      // Run database dump command
      const output = await dbUtil.dump(dbName, outFile);

      // Get file stats and file checksum
      const fileStats = fs.statSync(outFile);
      const sha256Hash = await hashFile(outFile, "sha256");

      await db.transaction(async (tx) => {
        await tx
          .update(backupModel)
          .set({
            status: "success",
            output,
            key,
            hash: sha256Hash,
            size: fileStats.size,
          })
          .where(eq(backupModel.id, task.id));

        await tx
          .update(databaseModel)
          .set({ lastBackupAt: sql`CURRENT_TIMESTAMP` })
          .where(eq(databaseModel.id, task.databaseId));
      });
    }

    if (task.type === "restore") {
      if (!task.key) {
        throw new Error("Missing backup file key!");
      }

      const filePath = path.join(BACKUP_DIR, task.key);
      if (!fs.existsSync(filePath)) {
        throw new Error("Backup file not found!");
      }

      const sha256Hash = await hashFile(filePath, "sha256");
      if (sha256Hash !== task.hash) {
        throw new Error("Backup file hash mismatch!");
      }

      const output = await dbUtil.restore(filePath);
      await db
        .update(backupModel)
        .set({ status: "success", output })
        .where(eq(backupModel.id, task.id));
    }
  } catch (err) {
    const output = (err as Error)?.message || "An error occured.";
    await db
      .update(backupModel)
      .set({ status: "failed", output })
      .where(eq(backupModel.id, task.id));
  }
};

const getPendingTasks = async () => {
  const queue = await db.query.backup.findMany({
    where: (i) => and(eq(i.status, "pending")),
    orderBy: (i) => asc(i.createdAt),
    with: {
      server: {
        columns: { connection: true, ssh: true },
      },
      database: {
        columns: { name: true },
      },
    },
  });

  return queue;
};

type PendingTasks = Awaited<ReturnType<typeof getPendingTasks>>;

export const processBackup = async () => {
  if (isRunning) return;

  isRunning = true;
  const queue = await getPendingTasks();
  const tasks = queue.map(runBackup);
  await Promise.all(tasks);
  isRunning = false;
};
