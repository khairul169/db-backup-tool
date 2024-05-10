import DatabaseUtil from "@/lib/database-util";
import { DOCKER_HOST, BACKUP_DIR } from "@/consts";
import { mkdir } from "@/utility/utils";
import path from "path";

const main = async () => {
  try {
    const db = new DatabaseUtil({
      type: "postgres",
      host: DOCKER_HOST,
      user: "postgres",
      pass: "postgres",
      port: 5432,
    });

    const databases = await db.getDatabases();
    console.log(databases);

    const dbName = "test";

    // Create backup
    const outDir = path.join(BACKUP_DIR, db.config.host, dbName);
    mkdir(outDir);
    const outFile = path.join(outDir, `/${Date.now()}.tar`);
    console.log(await db.dump(dbName, outFile));
    console.log(outFile);

    // Restore backup
    console.log(await db.restore(outFile));
  } catch (err) {
    console.log((err as any).message);
  }
};

main();
