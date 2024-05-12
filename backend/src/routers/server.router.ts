import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import ServerService from "../services/server.service";
import {
  checkServerSchema,
  createServerSchema,
  updateServerSchema,
} from "../schemas/server.schema";
import DatabaseUtil from "../lib/database-util";

const serverService = new ServerService();
const router = new Hono()

  .get("/", async (c) => {
    return c.json(await serverService.getAll());
  })

  .post("/", zValidator("json", createServerSchema), async (c) => {
    const data = c.req.valid("json");
    const result = await serverService.create(data);
    return c.json(result);
  })

  .post("/check", zValidator("json", checkServerSchema), async (c) => {
    const data = c.req.valid("json");
    const db = new DatabaseUtil(data.connection);

    try {
      const databases = await db.getDatabases();
      return c.json({ success: true, databases });
    } catch (err) {
      throw new HTTPException(400, {
        message: (err as any).message || "Cannot connect to the database.",
      });
    }
  })

  .get("/check/:id", async (c) => {
    const { id } = c.req.param();
    const server = await serverService.getOrFail(id);
    const db = new DatabaseUtil(server.connection);

    try {
      const databases = await db.getDatabases();
      return c.json({ success: true, databases });
    } catch (err) {
      throw new HTTPException(400, {
        message: (err as any).message || "Cannot connect to the database.",
      });
    }
  })

  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const server = await serverService.getById(id);
    return c.json(server);
  })

  .patch("/:id", zValidator("json", updateServerSchema), async (c) => {
    const server = await serverService.getOrFail(c.req.param("id"));
    const data = c.req.valid("json");
    const result = await serverService.update(server, data);
    return c.json(result);
  });

export default router;
