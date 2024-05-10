import BaseDbms from "../dbms/base";
import PostgresDbms from "../dbms/postgres";
import type { DatabaseConfig, DatabaseListItem } from "../types/database.types";

class DatabaseUtil {
  private db = new BaseDbms();

  constructor(public config: DatabaseConfig) {
    switch (config.type) {
      case "postgres":
        this.db = new PostgresDbms(config);
        break;
      default:
        throw Error("Database type not supported: " + config.type);
    }
  }

  async getDatabases(): Promise<DatabaseListItem[]> {
    return this.db.getDatabases();
  }

  async dump(dbName: string, path: string): Promise<string> {
    return this.db.dump(dbName, path);
  }

  async restore(path: string): Promise<string> {
    return this.db.restore(path);
  }
}

export default DatabaseUtil;
