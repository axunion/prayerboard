import { createResource, createSignal, For, Show } from "solid-js";
import {
  activateBoard,
  createBoard,
  deleteBoard,
  listBoards,
} from "../api/client";
import type { Board } from "../shared/types";
import styles from "./AdminPage.module.css";

type Props = {
  token: string;
};

export default function AdminPage(props: Props) {
  const [boards, { refetch }] = createResource(() => listBoards(props.token));
  const [name, setName] = createSignal("");
  const [eventDate, setEventDate] = createSignal("");
  const [creating, setCreating] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const handleCreate = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!name().trim() || !eventDate()) return;
    setCreating(true);
    setError(null);
    try {
      await createBoard(props.token, name().trim(), eventDate());
      setName("");
      setEventDate("");
      refetch();
    } catch {
      setError("作成に失敗しました。もう一度お試しください。");
    } finally {
      setCreating(false);
    }
  };

  const handleActivate = async (boardId: string) => {
    setError(null);
    try {
      await activateBoard(props.token, boardId);
      refetch();
    } catch {
      setError("表示の変更に失敗しました。");
    }
  };

  const handleDelete = async (board: Board) => {
    const label = `「${board.name}」を削除しますか？`;
    if (!confirm(label)) return;
    setError(null);
    try {
      await deleteBoard(props.token, board.id);
      refetch();
    } catch {
      setError("削除に失敗しました。");
    }
  };

  return (
    <div class={styles.page}>
      <header class={styles.header}>
        <span class={styles.brand}>Prayerboard</span>
        <span class={styles.adminLabel}>管理画面</span>
      </header>

      <main class={styles.main}>
        <Show when={error()}>
          <p class={styles.error}>{error()}</p>
        </Show>

        <section class={styles.section}>
          <h2 class={styles.sectionTitle}>ボードを作成</h2>
          <form class={styles.form} onSubmit={handleCreate}>
            <label class={styles.label}>
              ボード名
              <input
                class={styles.input}
                type="text"
                value={name()}
                onInput={(e) => setName(e.currentTarget.value)}
                required
                maxLength={100}
                placeholder="例：2025年度クリスマス礼拝"
              />
            </label>
            <label class={styles.label}>
              開催日
              <input
                class={styles.input}
                type="date"
                value={eventDate()}
                onInput={(e) => setEventDate(e.currentTarget.value)}
                required
              />
            </label>
            <button type="submit" class={styles.btn} disabled={creating()}>
              {creating() ? "作成中..." : "作成する"}
            </button>
          </form>
        </section>

        <section class={styles.section}>
          <h2 class={styles.sectionTitle}>ボード一覧</h2>
          <Show
            when={!boards.loading}
            fallback={<p class={styles.hint}>読み込み中...</p>}
          >
            <Show
              when={(boards() ?? []).length > 0}
              fallback={
                <p class={styles.hint}>
                  ボードがありません。上のフォームから作成してください。
                </p>
              }
            >
              <ul class={styles.boardList}>
                <For each={boards()}>
                  {(board: Board) => (
                    <li
                      class={styles.boardItem}
                      classList={{ [styles.activeItem]: board.isActive }}
                    >
                      <div class={styles.boardInfo}>
                        <span class={styles.boardName}>{board.name}</span>
                        <span class={styles.boardDate}>{board.eventDate}</span>
                      </div>
                      <div class={styles.boardActions}>
                        <Show
                          when={board.isActive}
                          fallback={
                            <button
                              type="button"
                              class={styles.btnActivate}
                              onClick={() => handleActivate(board.id)}
                            >
                              表示する
                            </button>
                          }
                        >
                          <span class={styles.activeBadge}>表示中</span>
                        </Show>
                        <button
                          type="button"
                          class={styles.btnDelete}
                          onClick={() => handleDelete(board)}
                        >
                          削除
                        </button>
                      </div>
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </Show>
        </section>
      </main>
    </div>
  );
}
