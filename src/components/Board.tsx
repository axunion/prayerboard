import { type Component, For } from "solid-js";
import { boardData } from "../stores/BoardData";

const Board: Component = () => {
  return (
    <div class="p-4 max-w-screen-md m-auto grid gap-3">
      <For each={boardData.items}>
        {(item) => (
          <div class="bg-white p-3 rounded-sm shadow-md">
            <div class="font-bold">{item.name}</div>
            <p>{item.content}</p>
          </div>
        )}
      </For>
    </div>
  );
};

export default Board;
