import { Plus } from "lucide-solid";
import { createSignal } from "solid-js";
import styles from "./App.module.css";
import Board from "./components/Board";
import PostDialog from "./components/PostDialog";

export default function App() {
  const [dialogOpen, setDialogOpen] = createSignal(false);

  return (
    <div class={styles.app}>
      <header class={styles.header}>
        <h1 class={styles.title}>Prayerboard</h1>
      </header>
      <main class={styles.main}>
        <Board />
      </main>
      <button
        type="button"
        class={styles.fab}
        onClick={() => setDialogOpen(true)}
        aria-label="書き込む"
      >
        <Plus size={20} aria-hidden="true" />
        書き込む
      </button>
      <PostDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
