import { processBackup } from "../schedulers/process-backup";
import {
  createBackupSchema,
  getAllBackupQuery,
  restoreBackupSchema,
} from "../schemas/backup.schema";
import BackupService from "../services/backup.service";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const backupService = new BackupService();
const router = new Hono()

  .get("/", zValidator("query", getAllBackupQuery), async (c) => {
    const query = c.req.valid("query");
    const result = await backupService.getAll(query);
    return c.json(result);
  })

  .post("/", zValidator("json", createBackupSchema), async (c) => {
    const body = c.req.valid("json");
    const result = await backupService.create(body);

    // start backup scheduler
    processBackup();

    return c.json(result);
  })

  .post("/restore", zValidator("json", restoreBackupSchema), async (c) => {
    const body = c.req.valid("json");
    const result = await backupService.restore(body);

    // start restore scheduler
    processBackup();

    return c.json(result);
  });

export default router;
