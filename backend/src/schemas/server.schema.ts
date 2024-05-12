import { z } from "zod";

const sshSchema = z
  .object({
    host: z.string(),
    port: z.number().optional(),
    user: z.string(),
    pass: z.string().optional(),
    privateKey: z.string().optional(),
  })
  .optional()
  .nullable();

const postgresSchema = z.object({
  type: z.literal("postgres"),
  host: z.string(),
  port: z.coerce.number().int().optional(),
  user: z.string(),
  pass: z.string().optional(),
});

export const connectionSchema = z.discriminatedUnion("type", [postgresSchema]);

export const serverBackupSchema = z.object({
  compress: z.boolean(),
  scheduled: z.boolean(),
  every: z.coerce.number().min(1),
  interval: z.enum([
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ]),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .optional(),
  day: z.coerce.number().min(0).max(6).optional(),
  month: z.coerce.number().min(0).max(11).optional(),
});

export type ServerBackupSchema = z.infer<typeof serverBackupSchema>;

export const createServerSchema = z.object({
  name: z.string().min(1),
  ssh: sshSchema,
  connection: connectionSchema,
  isActive: z.boolean().optional(),
  databases: z.string().array().min(1),
  backup: serverBackupSchema.optional().nullable(),
});

export type CreateServerSchema = z.infer<typeof createServerSchema>;

export const updateServerSchema = createServerSchema.partial();

export type UpdateServerSchema = z.infer<typeof updateServerSchema>;

export const checkServerSchema = z.object({
  ssh: sshSchema,
  connection: connectionSchema,
});

export type CheckServerSchema = z.infer<typeof checkServerSchema>;
