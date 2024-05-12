import { Hono } from "hono";
import routers from "./routers";
import { initScheduler } from "./schedulers";
import { __PROD } from "./consts";
import { serveStatic } from "hono/bun";

const app = new Hono();
initScheduler();

// Add API routes
app.route(__PROD ? "/api" : "/", routers);

// Serve frontend
if (__PROD) {
  app.use(serveStatic({ root: "./public" }));
  app.use("*", serveStatic({ path: "./public/index.html" }));

  const PORT = Number(process.env.PORT) || 3000;
  console.log(`App listening on http://localhost:${PORT}`);
}

export default app;
