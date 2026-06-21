import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { createBoardSchema } from "../../shared/schemas";
import type { Board } from "../../shared/types";
import { boards, posts } from "../db/schema";
import { adminAuth } from "../middleware/adminAuth";
import type { Bindings } from "../types";

function toBoard(row: typeof boards.$inferSelect): Board {
  return {
    id: row.id,
    name: row.name,
    eventDate: row.eventDate,
    isActive: row.isActive === 1,
    createdAt: row.createdAt,
  };
}

function purgeBoardCache(
  requestUrl: string,
  ctx: { waitUntil(p: Promise<unknown>): void },
) {
  const cacheUrl = new URL(requestUrl);
  cacheUrl.pathname = "/api/board/current";
  ctx.waitUntil(caches.default.delete(new Request(cacheUrl.toString())));
}

export const adminRoutes = new Hono<{ Bindings: Bindings }>();

adminRoutes.use("/*", adminAuth);

adminRoutes.get("/boards", async (c) => {
  const db = drizzle(c.env.DB);
  const rows = await db.select().from(boards).orderBy(desc(boards.createdAt));
  return c.json(rows.map(toBoard));
});

adminRoutes.post("/boards", async (c) => {
  const body = await c.req.json();
  const parsed = createBoardSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Invalid input", details: parsed.error.issues },
      400,
    );
  }

  const db = drizzle(c.env.DB);
  const id = crypto.randomUUID();
  const now = Date.now();
  await db.insert(boards).values({
    id,
    name: parsed.data.name,
    eventDate: parsed.data.eventDate,
    isActive: 0,
    createdAt: now,
  });
  const newBoard: Board = {
    id,
    name: parsed.data.name,
    eventDate: parsed.data.eventDate,
    isActive: false,
    createdAt: now,
  };
  return c.json(newBoard, 201);
});

adminRoutes.post("/boards/:id/activate", async (c) => {
  const { id } = c.req.param();
  const db = drizzle(c.env.DB);

  // Guard: verify the target board exists before touching any rows
  const target = await db.select().from(boards).where(eq(boards.id, id)).get();
  if (!target) {
    return c.json({ error: "Board not found" }, 404);
  }

  // Deactivate all then activate the target atomically
  await db.batch([
    db.update(boards).set({ isActive: 0 }),
    db.update(boards).set({ isActive: 1 }).where(eq(boards.id, id)),
  ]);

  purgeBoardCache(c.req.url, c.executionCtx);
  return c.json({ success: true });
});

adminRoutes.delete("/boards/:id", async (c) => {
  const { id } = c.req.param();
  const db = drizzle(c.env.DB);
  await db.delete(boards).where(eq(boards.id, id));
  purgeBoardCache(c.req.url, c.executionCtx);
  return c.json({ success: true });
});

adminRoutes.delete("/posts/:id", async (c) => {
  const { id } = c.req.param();
  const db = drizzle(c.env.DB);
  await db.delete(posts).where(eq(posts.id, id));
  purgeBoardCache(c.req.url, c.executionCtx);
  return c.json({ success: true });
});
