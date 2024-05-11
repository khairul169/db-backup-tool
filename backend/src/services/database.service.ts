import db from "../db";
import { databaseModel } from "../db/models";
import { desc, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export default class DatabaseService {
  async getAll() {
    const servers = await db.query.database.findMany({
      orderBy: desc(databaseModel.createdAt),
    });
    return servers;
  }

  async getOrFail(id: string) {
    const data = await db.query.database.findFirst({
      where: eq(databaseModel.id, id),
    });
    if (!data) {
      throw new HTTPException(404, { message: "Database not found." });
    }
    return data;
  }
}
