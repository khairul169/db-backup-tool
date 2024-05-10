import { Hono, type Context } from "hono";
import server from "./server.router";

const handleError = (err: Error, c: Context) => {
  return c.json({
    success: false,
    error: err,
    message: err.message,
  });
};

const routers = new Hono()
  .onError(handleError)
  .get("/health-check", (c) => c.text("OK"))
  .route("/servers", server);

export default routers;
