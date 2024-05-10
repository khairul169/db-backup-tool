import scheduler from "node-schedule";
import { processBackup } from "./process-backup";

export const initScheduler = () => {
  scheduler.scheduleJob("*/10 * * * * *", processBackup);
};
