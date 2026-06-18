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
      dialogRef.close();
    }
  });

  const close = () => {
    formRef.reset();
    props.onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      class={styles.dialog}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div class={styles.panel}>
        <button
          type="button"
          class={styles.closeBtn}
          onClick={close}
          aria-label="閉じる"
        >
          <X size={18} />
        </button>
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
            <input name="name" class={styles.input} required maxLength={50} />
          </label>
          <label class={styles.label}>
            メッセージ
            <textarea
              name="content"
              class={styles.textarea}
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
