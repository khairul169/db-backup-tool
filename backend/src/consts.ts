import path from "path";

export const DOCKER_HOST = "host.docker.internal";
export const STORAGE_DIR = path.resolve(__dirname, "../storage");
export const BACKUP_DIR = STORAGE_DIR + "/backups";
export const DATABASE_PATH = path.join(STORAGE_DIR, "database.db");
