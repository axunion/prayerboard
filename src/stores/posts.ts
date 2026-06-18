import { createStore } from "solid-js/store";

export type Post = {
  id: string;
  name: string;
  content: string;
  createdAt: number;
};

const [state, setState] = createStore<{ posts: Post[] }>({ posts: [] });

export const postState = state;

export const addPost = (name: string, content: string): void => {
  setState("posts", (prev) => [
    { id: crypto.randomUUID(), name, content, createdAt: Date.now() },
    ...prev,
  ]);
};

export const clearPosts = (): void => {
  setState("posts", []);
};
