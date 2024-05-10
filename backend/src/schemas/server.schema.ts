import { z } from "zod";

export const serverTypeEnum = ["postgres"] as const;

export const serverSchema = z.object({
  name: z.string().min(1),
  ssh: z
    .object({
      host: z.string(),
      port: z.number().optional(),
      user: z.string(),
      pass: z.string().optional(),
      privateKey: z.string().optional(),
    })
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
});

const postgresSchema = serverSchema.merge(
  z.object({
    type: z.literal("postgres"),
    connection: z.object({
      host: z.string(),
      port: z.number().optional(),
      user: z.string(),
      pass: z.string().optional(),
    }),
  })
);

export const createServerSchema = z.discriminatedUnion("type", [
  postgresSchema,
]);

export type CreateServerSchema = z.infer<typeof createServerSchema>;
