import db from "@/db";
import { databaseModel, serverModel, type ServerModel } from "@/db/models";
import type { CreateServerSchema } from "@/schemas/server.schema";
import { asc, desc, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export default class ServerService {
  async getAll() {
    const servers = await db.query.servers.findMany({
      columns: { connection: false, ssh: false },
      orderBy: asc(serverModel.createdAt),
      with: {
        databases: {
          columns: { id: true, name: true, lastBackupAt: true },
          orderBy: desc(databaseModel.createdAt),
        },
      },
    });
    return servers;
  }

  async getOrFail(id: string) {
    const server = await db.query.servers.findFirst({
      where: eq(serverModel.id, id),
    });
    if (!server) {
      throw new HTTPException(404, { message: "Server not found." });
    }
    return this.parse(server);
  }

  async getById(id: string) {
    const server = await db.query.servers.findFirst({
      where: eq(serverModel.id, id),
      with: {
        databases: true,
      },
    });
    return server;
  }

  async create(data: CreateServerSchema) {
    return db.transaction(async (tx) => {
      const isExist = await tx.query.servers.findFirst({
        where: eq(serverModel.name, data.name),
      });
      if (isExist) {
        throw new HTTPException(400, { message: "Server name already exists" });
      }

      const dataValue = {
        ...data,
        type: data.connection.type,
        connection: data.connection ? JSON.stringify(data.connection) : null,
        ssh: data.ssh ? JSON.stringify(data.ssh) : null,
      };

      // Create server
      const [result] = await tx
        .insert(serverModel)
        .values(dataValue)
        .returning();

      // Create databases
      await tx.insert(databaseModel).values(
        data.databases.map((i) => ({
          serverId: result.id,
          name: i,
        }))
      );

      return data;
    });
  }

  parse(data: ServerModel) {
    const result = {
      ...data,
      connection: data.connection ? JSON.parse(data.connection) : null,
      ssh: data.ssh ? JSON.parse(data.ssh) : null,
    };

    return result;
  }
}
