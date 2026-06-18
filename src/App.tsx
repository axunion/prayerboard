import { Plus } from "lucide-solid";
import { createSignal } from "solid-js";
import styles from "./App.module.css";
import Board from "./components/Board";
import PostDialog from "./components/PostDialog";
import { boardState } from "./stores/board";

export default function App() {
  const [dialogOpen, setDialogOpen] = createSignal(false);

  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div class={styles.app}>
      <header class={styles.header}>
        <span class={styles.brand}>Prayerboard</span>
        <div class={styles.boardMeta}>
          <span class={styles.boardName}>{boardState.name}</span>
          <time class={styles.boardDate}>{today}</time>
        </div>
      </header>
      <main class={styles.main}>
        <Board />
      </main>
      <button
        type="button"
        class={styles.fab}
        onClick={() => setDialogOpen(true)}
        aria-label="メッセージを書く"
      >
        <Plus size={22} aria-hidden="true" />
      </button>
      <PostDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
