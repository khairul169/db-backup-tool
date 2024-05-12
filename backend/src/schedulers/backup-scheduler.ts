import { and, eq, ne, gte, sql } from "drizzle-orm";
import db from "../db";
import {
  backupModel,
  databaseModel,
  serverModel,
  type InsertBackupModel,
} from "../db/models";
import dayjs from "dayjs";
import ServerService from "../services/server.service";
import type { CreateBackupSchema } from "../schemas/backup.schema";

export const backupScheduler = async () => {
  const serverService = new ServerService();
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

  const queue = await db.query.servers.findMany({
    where: and(
      eq(serverModel.isActive, true),
      gte(
        sql`strftime('%s', ${now})`,
        sql`strftime('%s', ${serverModel.nextBackup})`
      )
    ),
    with: {
      databases: {
        columns: { id: true },
        where: eq(databaseModel.isActive, true),
      },
    },
  });

  const tasks = queue.map(async (item) => {
    console.log("CREATING BACKUP SCHEDULE FOR " + item.name);

    try {
      const backups: InsertBackupModel[] = item.databases.map((d) => ({
        serverId: item.id,
        databaseId: d.id,
        type: "backup",
      }));
      await db.insert(backupModel).values(backups).execute();

      const nextBackup = serverService.calculateNextBackup(item);
      await db
        .update(serverModel)
        .set({ nextBackup })
        .where(eq(serverModel.id, item.id));
    } catch (err) {
      console.error(err);
    }
  });

  await Promise.all(tasks);
};
