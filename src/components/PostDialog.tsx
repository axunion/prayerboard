import { X } from "lucide-solid";
import { createEffect } from "solid-js";
import { addPost } from "../stores/posts";
import styles from "./PostDialog.module.css";

type Props = {
  open: () => boolean;
  onClose: () => void;
};

export default function PostDialog(props: Props) {
  let dialogRef!: HTMLDialogElement;
  let formRef!: HTMLFormElement;

  createEffect(() => {
    if (props.open()) {
      if (!dialogRef.open) dialogRef.showModal();
    } else {
      if (dialogRef.open) dialogRef.close();
    }
  });

  const close = () => {
    formRef.reset();
    props.onClose();
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <dialog> handles keyboard via the native cancel event (Escape)
    <dialog
      ref={dialogRef}
      class={styles.dialog}
      onClick={(e) => {
        if (e.target === dialogRef) close();
      }}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div class={styles.panel}>
        <div class={styles.header}>
          <h2 class={styles.title}>メッセージを書く</h2>
          <button
            type="button"
            class={styles.closeBtn}
            onClick={close}
            aria-label="閉じる"
          >
            <X size={20} />
          </button>
        </div>
        <form
          ref={formRef}
          class={styles.form}
          onSubmit={(e: SubmitEvent) => {
            e.preventDefault();
            const data = new FormData(formRef);
            const name = (data.get("name") as string).trim();
            const content = (data.get("content") as string).trim();
            if (!name || !content) return;
            addPost(name, content);
            close();
          }}
        >
          <label class={styles.label}>
            お名前
            <input
              name="name"
              class={styles.input}
              placeholder="お名前を入力してください"
              required
              maxLength={50}
            />
          </label>
          <label class={styles.label}>
            メッセージ
            <textarea
              name="content"
              class={styles.textarea}
              placeholder="メッセージを入力してください"
              required
              maxLength={500}
            />
          </label>
          <button type="submit" class={styles.submitBtn}>
            送る
          </button>
        </form>
      </div>
    </dialog>
  );
}
