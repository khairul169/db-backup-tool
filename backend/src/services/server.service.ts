import db from "../db";
import { databaseModel, serverModel, type ServerModel } from "../db/models";
import type {
  CreateServerSchema,
  UpdateServerSchema,
} from "../schemas/server.schema";
import { and, asc, desc, eq, ne } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import dayjs from "dayjs";

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

    if (!server) {
      return null;
    }

    const result = this.parse(server);
    delete result.connection.pass;

    return result;
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
        nextBackup: this.calculateNextBackup(data as never),
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

      const server = this.parse(result);
      if (server.connection?.pass) {
        delete server.connection.pass;
      }

      return server;
    });
  }

  async update(
    server: Awaited<ReturnType<typeof this.getOrFail>>,
    data: UpdateServerSchema
  ) {
    if (data.name) {
      const isExist = await db.query.servers.findFirst({
        where: and(
          ne(serverModel.id, server.id),
          eq(serverModel.name, data.name)
        ),
      });
      if (isExist) {
        throw new HTTPException(400, { message: "Server name already exists" });
      }
    }

    const dataValue = {
      ...data,
      type: data.connection?.type || server.type,
      connection: data.connection
        ? JSON.stringify({
            ...data.connection,
            pass: data.connection.pass || server.connection?.pass,
          })
        : undefined,
      ssh: data.ssh ? JSON.stringify(data.ssh) : undefined,
      nextBackup: data.backup
        ? this.calculateNextBackup(data as never)
        : undefined,
    };

    // Update server
    const [result] = await db
      .update(serverModel)
      .set(dataValue)
      .where(eq(serverModel.id, server.id))
      .returning();

    return result;
  }

  parse<T extends Pick<ServerModel, "connection" | "ssh">>(data: T) {
    const result = {
      ...data,
      connection: data.connection ? JSON.parse(data.connection) : null,
      ssh: data.ssh ? JSON.parse(data.ssh) : null,
    };

    return result;
  }

  calculateNextBackup(
    server: Pick<ServerModel, "backup">,
    from?: Date | string | null
  ) {
    if (!server.backup?.scheduled) {
      return null;
    }

    let date = dayjs(from);
    const {
      interval = "day",
      every = 1,
      time = "00:00",
      day = 0,
      month = 0,
    } = server.backup || {};
    const [hh, mm] = time.split(":").map(Number);

    if (Number.isNaN(hh) || Number.isNaN(mm)) {
      throw new Error("Invalid time format");
    }

    date = date.add(every || 1, interval);

    if (interval !== "second") {
      date = date.set("second", 0).set("millisecond", 0);
    }
    if (["day", "week", "month", "year"].includes(interval)) {
      date = date.set("hour", hh).set("minute", mm);
    }
    if (["week", "month"].includes(interval)) {
      date = date.set("day", day);
    }
    if (interval === "year") {
      date = date.set("month", month).set("date", 1);
    }

    return date.format("YYYY-MM-DD HH:mm:ss");
  }
}
