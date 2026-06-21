import { Inbox } from "lucide-solid";
import { For, Show } from "solid-js";
import type { Post } from "../shared/types";
import styles from "./Board.module.css";
import Note from "./Note";

type Props = {
  posts: Post[];
};

export default function Board(props: Props) {
  return (
    <Show
      when={props.posts.length > 0}
      fallback={
        <div class={styles.empty}>
          <Inbox size={52} strokeWidth={1.25} class={styles.emptyIcon} />
        </div>
      }
    >
      <div class={styles.board}>
        <For each={props.posts}>
          {(post) => <Note name={post.name} content={post.content} />}
        </For>
      </div>
    </Show>
  );
}
