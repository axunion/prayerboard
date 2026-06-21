import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const boards = sqliteTable(
  "boards",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    eventDate: text("event_date").notNull(),
    isActive: int("is_active").notNull().default(0),
    createdAt: int("created_at").notNull(),
  },
  (t) => [index("boards_is_active_idx").on(t.isActive)],
);

export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey(),
    boardId: text("board_id")
      .notNull()
      .references(() => boards.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    content: text("content").notNull(),
    createdAt: int("created_at").notNull(),
  },
  (t) => [index("posts_board_id_idx").on(t.boardId)],
);
