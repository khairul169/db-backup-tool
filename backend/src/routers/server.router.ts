import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createServerSchema } from "@/schemas/server.schema";
import db from "@/db";
import { asc, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { serverModel } from "@/db/models";

const router = new Hono()

  .get("/", async (c) => {
    const servers = await db.query.servers.findMany({
      columns: { connection: false, ssh: false },
      orderBy: asc(serverModel.createdAt),
    });
    return c.json(servers);
  })

  .post("/", zValidator("json", createServerSchema), async (c) => {
    const data = c.req.valid("json");
    const isExist = await db.query.servers.findFirst({
      where: eq(serverModel.name, data.name),
    });
    if (isExist) {
      throw new HTTPException(400, { message: "Server name already exists" });
    }

    const dataValue = {
      ...data,
      connection: data.connection ? JSON.stringify(data.connection) : null,
      ssh: data.ssh ? JSON.stringify(data.ssh) : null,
    };
    const [result] = await db.insert(serverModel).values(dataValue).returning();

    return c.json(result);
  });

export default router;
