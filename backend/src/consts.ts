import path from "path";

export const __PROD = process.env.NODE_ENV === "production";
export const __DEV = !__PROD;
export const DOCKER_HOST = "host.docker.internal";
export const STORAGE_DIR = path.resolve(process.cwd(), "storage");
export const BACKUP_DIR = STORAGE_DIR + "/backups";
export const DATABASE_PATH = path.join(STORAGE_DIR, "database.db");
