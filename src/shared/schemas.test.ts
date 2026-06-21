import { describe, expect, it } from "vitest";
import { createBoardSchema, createPostSchema } from "./schemas";

describe("createPostSchema", () => {
  it("accepts valid name and content", () => {
    const result = createPostSchema.safeParse({
      name: "Alice",
      content: "Hello",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createPostSchema.safeParse({ name: "", content: "Hello" });
    expect(result.success).toBe(false);
  });

  it("rejects whitespace-only name after trimming", () => {
    const result = createPostSchema.safeParse({
      name: "   ",
      content: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name exceeding 50 characters", () => {
    const result = createPostSchema.safeParse({
      name: "a".repeat(51),
      content: "Hello",
    });
    expect(result.success).toBe(false);
  });

  it("accepts name of exactly 50 characters", () => {
    const result = createPostSchema.safeParse({
      name: "a".repeat(50),
      content: "Hello",
    });
    expect(result.success).toBe(true);
  });

  it("rejects content exceeding 500 characters", () => {
    const result = createPostSchema.safeParse({
      name: "Alice",
      content: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepts content of exactly 500 characters", () => {
    const result = createPostSchema.safeParse({
      name: "Alice",
      content: "a".repeat(500),
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty content", () => {
    const result = createPostSchema.safeParse({ name: "Alice", content: "" });
    expect(result.success).toBe(false);
  });
});

describe("createBoardSchema", () => {
  it("accepts valid name and event date", () => {
    const result = createBoardSchema.safeParse({
      name: "Sunday Service",
      eventDate: "2025-12-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createBoardSchema.safeParse({
      name: "",
      eventDate: "2025-12-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name exceeding 100 characters", () => {
    const result = createBoardSchema.safeParse({
      name: "a".repeat(101),
      eventDate: "2025-12-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects date not in YYYY-MM-DD format", () => {
    const result = createBoardSchema.safeParse({
      name: "Sunday Service",
      eventDate: "2025/12/01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing date", () => {
    const result = createBoardSchema.safeParse({ name: "Sunday Service" });
    expect(result.success).toBe(false);
  });

  it("rejects an impossible month (13)", () => {
    const result = createBoardSchema.safeParse({
      name: "Sunday Service",
      eventDate: "2025-13-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a day that does not exist in the month (Feb 30)", () => {
    const result = createBoardSchema.safeParse({
      name: "Sunday Service",
      eventDate: "2025-02-30",
    });
    expect(result.success).toBe(false);
  });
});
