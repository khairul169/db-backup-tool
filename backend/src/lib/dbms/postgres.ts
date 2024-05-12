import type {
  DatabaseListItem,
  DumpOptions,
  PostgresConfig,
} from "../../types/database.types";
import path from "path";
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

  async dump(dbName: string, path: string, options: DumpOptions = {}) {
    const { compress } = options;
    const ext = compress ? ".gz" : ".sql";
    const filename = path + ext;

    await exec([
      "pg_dump",
      this.dbUrl + `/${dbName}`,
      "-Cc",
      compress ? "-Z9" : null,
      "-f",
      filename,
    ]);

    return filename;
  }

  async restore(backupFile: string) {
    const ext = path.extname(backupFile);
    const isCompressed = ext === ".gz";
    let cmd = `psql ${this.dbUrl} < ${backupFile}`;

    if (isCompressed) {
      cmd = `zcat ${backupFile} | psql ${this.dbUrl}`;
    }

    return exec(["sh", "-c", cmd]);
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
