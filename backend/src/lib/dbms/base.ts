import type { DatabaseListItem, DumpOptions } from "../../types/database.types";

class BaseDbms {
  async getDatabases(): Promise<DatabaseListItem[]> {
    return [];
  }

  async dump(
    _dbName: string,
    _path: string,
    _options?: DumpOptions
  ): Promise<string> {
    return "";
  }

  async restore(_path: string): Promise<string> {
    return "";
  }
}

export default BaseDbms;
