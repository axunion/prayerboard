import { type Component, For, Show } from "solid-js";
import { boardData } from "../stores/BoardData";
import styles from "./Board.module.css";

const Board: Component = () => {
  return (
    <div class={styles.board}>
      <Show when={boardData.items.length === 0}>
        <div class={styles.empty}>
          <p>まだ投稿がありません</p>
        </div>
      </Show>

      <For each={boardData.items}>
        {(item) => (
          <div class={styles.item}>
            <div class={styles.name}>{item.name}</div>
            <p>{item.content}</p>
          </div>
        )}
      </For>
    </div>
  );
};

export default Board;
