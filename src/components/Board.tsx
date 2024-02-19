import { type Component, For, Show } from "solid-js";
import { boardData } from "../stores/BoardData";

const Board: Component = () => {
  return (
    <div class="max-w-screen-md m-auto p-6 flex flex-col gap-3">
      <Show when={boardData.items.length === 0}>
        <div class="bg-white mt-6 py-20 rounded-md shadow-md text-center">
          <p>まだ投稿がありません</p>
        </div>
      </Show>

      <For each={boardData.items}>
        {(item) => (
          <div class="bg-white p-3 rounded-md shadow-md">
            <div class="font-bold">{item.name}</div>
            <p>{item.content}</p>
          </div>
        )}
      </For>
    </div>
  );
};

export default Board;
