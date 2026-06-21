import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { createPostSchema } from "../../shared/schemas";
import type { Board, CurrentBoardResponse, Post } from "../../shared/types";
import { boards, posts } from "../db/schema";
import type { Bindings } from "../types";

const CACHE_TTL_SECONDS = 60;

function toBoard(row: typeof boards.$inferSelect): Board {
  return {
    id: row.id,
    name: row.name,
    eventDate: row.eventDate,
    isActive: row.isActive === 1,
    createdAt: row.createdAt,
  };
}

function toPost(row: typeof posts.$inferSelect): Post {
  return {
    id: row.id,
    boardId: row.boardId,
    name: row.name,
    content: row.content,
    createdAt: row.createdAt,
  };
}

export const publicRoutes = new Hono<{ Bindings: Bindings }>();

publicRoutes.get("/board/current", async (c) => {
  const cache = caches.default;
  const cacheKey = new Request(c.req.url);

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const db = drizzle(c.env.DB);
  const board = await db
    .select()
    .from(boards)
    .where(eq(boards.isActive, 1))
    .get();

  let body: CurrentBoardResponse = null;
  if (board) {
    const boardPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.boardId, board.id))
      .orderBy(desc(posts.createdAt));
    body = { board: toBoard(board), posts: boardPosts.map(toPost) };
  }

  const json = JSON.stringify(body);
  const response = new Response(json, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}`,
    },
  });

  c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
});

publicRoutes.post("/posts", async (c) => {
  const body = await c.req.json();
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Invalid input", details: parsed.error.issues },
      400,
    );
  }

  const db = drizzle(c.env.DB);
  const activeBoard = await db
    .select()
    .from(boards)
    .where(eq(boards.isActive, 1))
    .get();
  if (!activeBoard) {
    return c.json({ error: "No active board" }, 404);
  }

  const id = crypto.randomUUID();
  const now = Date.now();
  await db.insert(posts).values({
    id,
    boardId: activeBoard.id,
    name: parsed.data.name,
    content: parsed.data.content,
    createdAt: now,
  });

  // Purge cached board response before responding so refetch sees fresh data
  const cacheUrl = new URL(c.req.url);
  cacheUrl.pathname = "/api/board/current";
  await caches.default.delete(new Request(cacheUrl.toString()));

  const post: Post = {
    id,
    boardId: activeBoard.id,
    name: parsed.data.name,
    content: parsed.data.content,
    createdAt: now,
  };
  return c.json(post, 201);
});
