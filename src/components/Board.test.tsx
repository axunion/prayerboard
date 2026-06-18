import { render } from "@solidjs/testing-library";
import { beforeEach, describe, expect, it } from "vitest";
import { addPost, clearPosts } from "../stores/posts";
import Board from "./Board";

describe("Board", () => {
  beforeEach(clearPosts);

  it("shows empty state text when no posts exist", () => {
    const { getByText } = render(() => <Board />);
    expect(getByText("まだメッセージがありません")).toBeTruthy();
  });

  it("renders one article per post", () => {
    addPost("Alice", "Hello world");
    addPost("Bob", "Another post");
    const { getAllByRole } = render(() => <Board />);
    expect(getAllByRole("article")).toHaveLength(2);
  });

  it("displays the poster name and content", () => {
    addPost("Alice", "Hello world");
    const { getByText } = render(() => <Board />);
    expect(getByText("Alice")).toBeTruthy();
    expect(getByText("Hello world")).toBeTruthy();
  });
});
