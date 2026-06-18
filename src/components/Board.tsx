import { Inbox } from "lucide-solid";
import { For, Show } from "solid-js";
import { postState } from "../stores/posts";
import styles from "./Board.module.css";
import Note from "./Note";

export default function Board() {
  return (
    <Show
      when={postState.posts.length > 0}
      fallback={
        <div class={styles.empty}>
          <Inbox size={52} strokeWidth={1.25} class={styles.emptyIcon} />
        </div>
      }
    >
      <div class={styles.board}>
        <For each={postState.posts}>
          {(post) => <Note name={post.name} content={post.content} />}
        </For>
      </div>
    </Show>
  );
}
