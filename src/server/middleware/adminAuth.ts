import type { Context, Next } from "hono";
import type { Bindings } from "../types";

/** Compare two strings in constant time via their SHA-256 digests. */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [da, db] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const va = new Uint8Array(da);
  const vb = new Uint8Array(db);
  // Both digests are always 32 bytes; XOR-fold to detect any difference
  let diff = 0;
  for (let i = 0; i < va.length; i++) {
    diff |= va[i] ^ vb[i];
  }
  return diff === 0;
}

export async function adminAuth(
  c: Context<{ Bindings: Bindings }>,
  next: Next,
) {
  const auth = c.req.header("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!(await safeEqual(token, c.env.ADMIN_SECRET))) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return next();
}
