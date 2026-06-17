import { type Component, onMount } from "solid-js";
import { addBoardItem } from "../stores/BoardData";
import styles from "./Form.module.css";

const keyframes = {
  fadeIn: [{ opacity: 0 }, { opacity: 1 }],
  fadeOut: [{ opacity: 1 }, { opacity: 0 }],
  slideUp: [
    { opacity: 0, transform: "scale(0.95)" },
    { opacity: 1 },
    { opacity: 1, transform: "scale(1)" },
  ],
  slideDown: [
    { opacity: 1, transform: "scale(1)" },
    { opacity: 0 },
    { opacity: 0, transform: "scale(0.95)" },
  ],
};

const options = {
  fadeIn: { duration: 200 },
  fadeOut: { duration: 250 },
  slideUp: { duration: 250 },
  slideDown: { duration: 200 },
};

const Form: Component<{
  showForm: boolean;
  setShowForm: (value: boolean) => void;
}> = (props) => {
  let overlay: HTMLDivElement | undefined;
  let form: HTMLFormElement | undefined;

  onMount(() => {
    overlay?.animate(keyframes.fadeIn, options.fadeIn);
    form?.animate(keyframes.slideUp, options.slideUp);
  });

  const close = () => {
    if (!overlay || !form) return;
    const animation = overlay.animate(keyframes.fadeOut, options.fadeOut);
    form.animate(keyframes.slideDown, options.slideDown);

    animation.onfinish = () => props.setShowForm(false);
  };

  const submit = (e: Event) => {
    e.preventDefault();

    const formData = new FormData(form);
    const postData = Object.fromEntries(formData) as Record<string, string>;

    console.log(postData);

    addBoardItem([{ id: 0, name: postData.name, content: postData.content }]);

    close();
  };

  return (
    <div ref={overlay} class={styles.overlay}>
      <button
        type="button"
        class={styles.overlayBackdrop}
        onClick={close}
        aria-label="フォームを閉じる"
      />
      <form ref={form} class={styles.form} onSubmit={submit}>
        <input
          type="text"
          name="name"
          placeholder="お名前"
          required
          class={styles.input}
        />

        <textarea
          name="content"
          placeholder="内容"
          required
          class={styles.textarea}
        />

        <button type="submit" class={styles.button}>
          送信
        </button>
      </form>
    </div>
  );
};

export default Form;
