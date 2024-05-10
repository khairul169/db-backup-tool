import { z } from "zod";

export const getAllBackupQuery = z
  .object({
    page: z.coerce.number().int(),
    limit: z.coerce.number().int(),
    serverId: z.string().nanoid(),
    databaseId: z.string().nanoid(),
  })
  .partial()
  .optional();

export type GetAllBackupQuery = z.infer<typeof getAllBackupQuery>;

export const createBackupSchema = z.object({
  databaseId: z.string().nanoid(),
});

export type CreateBackupSchema = z.infer<typeof createBackupSchema>;

export const restoreBackupSchema = z.object({
  backupId: z.string().nanoid(),
});

export type RestoreBackupSchema = z.infer<typeof restoreBackupSchema>;
