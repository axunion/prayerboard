import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import type { Post } from "../shared/types";
import Board from "./Board";

function makePost(id: string, name: string, content: string): Post {
  return { id, boardId: "board-1", name, content, createdAt: Date.now() };
}

describe("Board", () => {
  it("shows no articles in empty state", () => {
    const { queryAllByRole } = render(() => <Board posts={[]} />);
    expect(queryAllByRole("article")).toHaveLength(0);
  });

  it("renders one article per post", () => {
    const posts = [
      makePost("1", "Alice", "Hello world"),
      makePost("2", "Bob", "Another post"),
    ];
    const { getAllByRole } = render(() => <Board posts={posts} />);
    expect(getAllByRole("article")).toHaveLength(2);
  });

  it("displays the poster name and content", () => {
    const posts = [makePost("1", "Alice", "Hello world")];
    const { getByText } = render(() => <Board posts={posts} />);
    expect(getByText("Alice")).toBeTruthy();
    expect(getByText("Hello world")).toBeTruthy();
  });
});
