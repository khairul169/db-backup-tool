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
  port: z.number().optional(),
  user: z.string(),
  pass: z.string(),
});

export const connectionSchema = z.discriminatedUnion("type", [postgresSchema]);

export const createServerSchema = z.object({
  name: z.string().min(1),
  ssh: sshSchema,
  connection: connectionSchema,
  isActive: z.boolean().optional(),
  databases: z.string().array().min(1),
});

export type CreateServerSchema = z.infer<typeof createServerSchema>;

export const checkServerSchema = z.object({
  ssh: sshSchema,
  connection: connectionSchema,
});

export type CheckServerSchema = z.infer<typeof checkServerSchema>;
