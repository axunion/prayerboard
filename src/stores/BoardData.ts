import { createStore } from "solid-js/store";

export interface BoardItem {
  id: number;
  name: string;
  description: string;
}

export interface BoardData {
  titel: string;
  date: string;
  items: BoardItem[];
}

export const [boardData, setBoardData] = createStore<BoardData>({
  titel: "",
  date: "",
  items: [],
});

export const setBoardTitle = (title: string) => {
  setBoardData("titel", title);
};

export const setBoardDate = (date: string) => {
  setBoardData("date", date);
};

export const addBoardItem = (newItems: BoardItem[]) => {
  setBoardData("items", (items) => [...items, ...newItems]);
};

export const updateBoardItem = (
  itemId: number,
  newItem: Partial<BoardItem>,
) => {
  setBoardData("items", (items) =>
    items.map((item) => (item.id === itemId ? { ...item, ...newItem } : item)),
  );
};

export const removeBoardItem = (itemId: number) => {
  setBoardData("items", (items) => items.filter((item) => item.id !== itemId));
};
