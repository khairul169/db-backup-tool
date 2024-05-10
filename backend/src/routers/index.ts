import { Hono } from "hono";
import { handleError } from "@/middlewares/error-handler";
import server from "./server.router";
import backup from "./backup.router";

const routers = new Hono()
  // Middlewares
  .onError(handleError)

  // App health check
  .get("/health-check", (c) => c.text("OK"))

  // Routes
  .route("/servers", server)
  .route("/backups", backup);

export default routers;
