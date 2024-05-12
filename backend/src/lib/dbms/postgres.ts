import type {
  DatabaseListItem,
  PostgresConfig,
} from "../../types/database.types";
import { exec } from "../../utility/process";
import { urlencode } from "../../utility/utils";
import BaseDbms from "./base";

class PostgresDbms extends BaseDbms {
  constructor(private config: PostgresConfig) {
    super();
  }

  async getDatabases() {
    return this.sql<DatabaseListItem>(
      "SELECT datname AS name, pg_size_pretty(pg_database_size(datname)) AS size \
       FROM pg_database WHERE datistemplate=false ORDER BY name ASC"
    );
  }

  async dump(dbName: string, path: string) {
    return exec(["pg_dump", this.dbUrl + `/${dbName}`, "-Z9", "-f", path]);
  }

  async restore(path: string) {
    return exec([
      "pg_restore",
      "-d",
      this.dbUrl,
      "-cC",
      "--if-exists",
      "--exit-on-error",
      // "-Ftar",
      path,
    ]);
  }

  private async sql<T = any>(query: string) {
    const sql = `SELECT row_to_json(row) FROM (${query}) row`;
    return exec(["psql", this.dbUrl, "-t", "-c", sql])
      .then((res) => res.split("\n").map((i) => i.trim()))
      .then((res) => res.filter((i) => i.length > 0))
      .then((i) => i.map((data) => JSON.parse(data) as T));
  }

  private get dbUrl() {
    const { user, pass = "", host } = this.config;
    const port = this.config.port || 5432;
    return `postgresql://${user}:${urlencode(pass)}@${host}:${port}`;
  }
}

export default PostgresDbms;
