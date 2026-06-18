import { beforeEach, describe, expect, it } from "vitest";
import { addPost, clearPosts, postState } from "./posts";

describe("posts store", () => {
  beforeEach(clearPosts);

  it("starts empty", () => {
    expect(postState.posts).toHaveLength(0);
  });

  it("adds a post with name, content, and a truthy id", () => {
    addPost("Alice", "Hello world");
    expect(postState.posts).toHaveLength(1);
    expect(postState.posts[0].name).toBe("Alice");
    expect(postState.posts[0].content).toBe("Hello world");
    expect(postState.posts[0].id).toBeTruthy();
  });

  it("inserts new posts before existing ones (newest first)", () => {
    addPost("Alice", "First");
    addPost("Bob", "Second");
    expect(postState.posts[0].name).toBe("Bob");
    expect(postState.posts[1].name).toBe("Alice");
  });

  it("assigns a unique id to each post", () => {
    addPost("Alice", "Same content");
    addPost("Alice", "Same content");
    const [a, b] = postState.posts;
    expect(a.id).not.toBe(b.id);
  });

  it("records a createdAt timestamp for each post", () => {
    const before = Date.now();
    addPost("Alice", "Timed post");
    const after = Date.now();
    expect(postState.posts[0].createdAt).toBeGreaterThanOrEqual(before);
    expect(postState.posts[0].createdAt).toBeLessThanOrEqual(after);
  });
});
