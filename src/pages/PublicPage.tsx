import { Plus } from "lucide-solid";
import { createResource, createSignal, Show } from "solid-js";
import { createPost, getCurrentBoard } from "../api/client";
import Board from "../components/Board";
import PostDialog from "../components/PostDialog";
import type { Post } from "../shared/types";
import styles from "./PublicPage.module.css";

const today = new Date().toLocaleDateString("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function PublicPage() {
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [optimisticPosts, setOptimisticPosts] = createSignal<Post[]>([]);
  const [submitError, setSubmitError] = createSignal<string | null>(null);

  const [boardData, { refetch }] = createResource(getCurrentBoard);

  // Prepend still-pending optimistic posts in front of the confirmed remote list
  const allPosts = () => [...optimisticPosts(), ...(boardData()?.posts ?? [])];

  const handleSubmit = async (name: string, content: string) => {
    setSubmitError(null);
    const tempId = crypto.randomUUID();
    const optimistic: Post = {
      id: tempId,
      boardId: boardData()?.board.id ?? "",
      name,
      content,
      createdAt: Date.now(),
    };
    setOptimisticPosts((prev) => [optimistic, ...prev]);

    try {
      await createPost(name, content);
      await refetch();
    } catch {
      setSubmitError("投稿に失敗しました。もう一度お試しください。");
    } finally {
      // Remove only this post's optimistic entry; other in-flight posts stay
      setOptimisticPosts((prev) => prev.filter((p) => p.id !== tempId));
    }
  };

  return (
    <div class={styles.app}>
      <header class={styles.header}>
        <span class={styles.brand}>Prayerboard</span>
        <Show when={boardData()}>
          <div class={styles.boardMeta}>
            <span class={styles.boardName}>{boardData()?.board.name}</span>
            <time class={styles.boardDate}>{today}</time>
          </div>
        </Show>
      </header>
      <main class={styles.main}>
        <Show when={submitError()}>
          <p class={styles.error}>{submitError()}</p>
        </Show>
        <Show
          when={!boardData.loading}
          fallback={<p class={styles.status}>読み込み中...</p>}
        >
          <Show
            when={boardData()}
            fallback={
              <p class={styles.status}>現在表示するボードがありません</p>
            }
          >
            <Board posts={allPosts()} />
          </Show>
        </Show>
      </main>
      <Show when={boardData()}>
        <button
          type="button"
          class={styles.fab}
          onClick={() => setDialogOpen(true)}
          aria-label="メッセージを書く"
        >
          <Plus size={22} aria-hidden="true" />
        </button>
        <PostDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSubmit}
        />
      </Show>
    </div>
  );
}
