import { Hono } from "hono";
import server from "./server.router";
import backup from "./backup.router";
import { cors } from "hono/cors";
import { handleError } from "../middlewares/error-handler";

const routers = new Hono()
  // Middlewares
  .onError(handleError)
  .use(cors())

  // App health check
  .get("/health-check", (c) => c.text("OK"))

  // Routes
  .route("/servers", server)
  .route("/backups", backup);

export type AppRouter = typeof routers;

export default routers;
