import scheduler from "node-schedule";
import { processBackup } from "./process-backup";
import { backupScheduler } from "./backup-scheduler";

export const initScheduler = () => {
  scheduler.scheduleJob("*/10 * * * * *", processBackup);
  // scheduler.scheduleJob("* * * * * *", backupScheduler);
  backupScheduler();
};
