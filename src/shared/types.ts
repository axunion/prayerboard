export type Board = {
  id: string;
  name: string;
  eventDate: string;
  isActive: boolean;
  createdAt: number;
};

export type Post = {
  id: string;
  boardId: string;
  name: string;
  content: string;
  createdAt: number;
};

export type CurrentBoardResponse = {
  board: Board;
  posts: Post[];
} | null;
