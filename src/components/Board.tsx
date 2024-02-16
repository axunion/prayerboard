import { type Component, For } from "solid-js";
import { boardData, addBoardItem } from "../stores/BoardData";

const Board: Component = () => {
  setTimeout(() => {
    const items = [
      {
        id: 1,
        name: "First",
        description: "This is the first item",
      },
      {
        id: 2,
        name: "Second",
        description: "This is the second item",
      },
      {
        id: 3,
        name: "Third",
        description: "This is the third item",
      },
      {
        id: 4,
        name: "Fourth",
        description: "This is the fourth item",
      },
    ];

    addBoardItem([...items, ...items]);
  }, 500);

  return (
    <div class="p-4 max-w-screen-md m-auto grid gap-3">
      <For each={boardData.items}>
        {(item) => (
          <div class="bg-white p-3 rounded-sm shadow-md">
            <div class="font-bold">{item.name}</div>
            <p>{item.description}</p>
          </div>
        )}
      </For>
    </div>
  );
};

export default Board;
