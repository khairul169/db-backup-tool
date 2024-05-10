import db from "@/db";
import { backupModel, serverModel } from "@/db/models";
import type {
  CreateBackupSchema,
  GetAllBackupQuery,
  RestoreBackupSchema,
} from "@/schemas/backup.schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import DatabaseService from "./database.service";
import { HTTPException } from "hono/http-exception";

export default class BackupService {
  private databaseService = new DatabaseService();

  /**
   * Get all backups
   */
  async getAll(query: GetAllBackupQuery = {}) {
    const { serverId, databaseId } = query;
    const page = query.page || 1;
    const limit = query.limit || 10;

    const backups = await db.query.backup.findMany({
      where: (i) =>
        and(
          serverId ? eq(i.serverId, serverId) : undefined,
          databaseId ? eq(i.databaseId, databaseId) : undefined
        ),
      orderBy: desc(serverModel.createdAt),
      limit,
      offset: (page - 1) * limit,
    });

    return backups;
  }

  async getOrFail(id: string) {
    const backup = await db.query.backup.findFirst({
      where: eq(backupModel.id, id),
    });
    if (!backup) {
      throw new HTTPException(404, { message: "Backup not found." });
    }
    return backup;
  }

  /**
   * Queue new backup
   */
  async create(data: CreateBackupSchema) {
    const database = await this.databaseService.getOrFail(data.databaseId);
    await this.checkPendingBackup(database.id);

    const [result] = await db
      .insert(backupModel)
      .values({
        type: "backup",
        serverId: database.serverId,
        databaseId: database.id,
      })
      .returning();

    return result;
  }

  async restore(data: RestoreBackupSchema) {
    const backup = await this.getOrFail(data.backupId);
    await this.checkPendingBackup(backup.databaseId);

    if (!backup.key) {
      throw new HTTPException(400, {
        message: "Cannot restore backup without file key.",
      });
    }

    const [result] = await db
      .insert(backupModel)
      .values({
        type: "restore",
        serverId: backup.serverId,
        databaseId: backup.databaseId,
        key: backup.key,
        hash: backup.hash,
        size: backup.size,
      })
      .returning();

    return result;
  }

  async checkPendingBackup(databaseId: string) {
    const hasOngoingBackup = await db.query.backup.findFirst({
      where: and(
        eq(backupModel.databaseId, databaseId),
        inArray(backupModel.status, ["pending", "running"])
      ),
    });
    if (hasOngoingBackup) {
      throw new HTTPException(400, {
        message: "There is already an ongoing backup for this database",
      });
    }
  }
}
