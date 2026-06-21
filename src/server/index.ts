import { Hono } from "hono";
import { adminRoutes } from "./routes/admin";
import { publicRoutes } from "./routes/public";
import type { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

// Admin API — bearer-token protected (token = the obscure URL segment)
app.route("/api/admin", adminRoutes);

// Public API
app.route("/api", publicRoutes);

// API paths that matched no route get a JSON 404; everything else is an SPA asset
app.notFound((c) => {
  if (c.req.path.startsWith("/api/")) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
