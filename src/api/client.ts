import type { Board, CurrentBoardResponse, Post } from "../shared/types";

const BASE = "/api";

export async function getCurrentBoard(): Promise<CurrentBoardResponse> {
  // no-store bypasses the browser HTTP cache so refetch always sees fresh data
  const res = await fetch(`${BASE}/board/current`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch board");
  return res.json() as Promise<CurrentBoardResponse>;
}

export async function createPost(name: string, content: string): Promise<Post> {
  const res = await fetch(`${BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, content }),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json() as Promise<Post>;
}

export async function listBoards(token: string): Promise<Board[]> {
  const res = await fetch(`${BASE}/admin/boards`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch boards");
  return res.json() as Promise<Board[]>;
}

export async function createBoard(
  token: string,
  name: string,
  eventDate: string,
): Promise<Board> {
  const res = await fetch(`${BASE}/admin/boards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, eventDate }),
  });
  if (!res.ok) throw new Error("Failed to create board");
  return res.json() as Promise<Board>;
}

export async function activateBoard(
  token: string,
  boardId: string,
): Promise<void> {
  const res = await fetch(`${BASE}/admin/boards/${boardId}/activate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to activate board");
}

export async function deleteBoard(
  token: string,
  boardId: string,
): Promise<void> {
  const res = await fetch(`${BASE}/admin/boards/${boardId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete board");
}

export async function deletePost(token: string, postId: string): Promise<void> {
  const res = await fetch(`${BASE}/admin/posts/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete post");
}
