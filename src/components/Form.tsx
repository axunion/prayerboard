import { type Component, onMount } from "solid-js";
import { addBoardItem } from "../stores/BoardData";

const keyframes = {
  fadeIn: [{ opacity: 0 }, { opacity: 1 }],
  fadeOut: [{ opacity: 1 }, { opacity: 0 }],
  slideUp: [
    { opacity: 0, transform: "translateY(20px)" },
    { opacity: 1 },
    { opacity: 1, transform: "translateY(0)" },
  ],
  slideDown: [
    { opacity: 1, transform: "translateY(0)" },
    { opacity: 1 },
    { opacity: 0, transform: "translateY(20px)" },
  ],
};

const options = {
  fadeIn: { duration: 200 },
  fadeOut: { duration: 200 },
  slideUp: { duration: 250 },
  slideDown: { duration: 250 },
};

const Form: Component<{
  showForm: boolean;
  setShowForm: (value: boolean) => void;
}> = (props) => {
  let overlay: HTMLDivElement | undefined;
  let form: HTMLFormElement | undefined;

  onMount(() => {
    overlay!.animate(keyframes.fadeIn, options.fadeIn);
    form!.animate(keyframes.slideUp, options.slideUp);
  });

  const close = () => {
    const animation = overlay!.animate(keyframes.fadeOut, options.fadeOut);
    form!.animate(keyframes.slideDown, options.slideDown);

    animation.onfinish = () => props.setShowForm(false);
  };

  const stopPropagation = (e: Event) => {
    e.stopPropagation();
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
    <div
      ref={overlay}
      class="bg-black/50 backdrop-blur-sm fixed inset-0 flex flex-col justify-center items-center p-4"
      onClick={close}
    >
      <form
        ref={form}
        class="max-w-screen-sm w-full"
        onClick={stopPropagation}
        onSubmit={submit}
      >
        <input
          type="text"
          name="name"
          placeholder="お名前"
          required
          class="bg-[--color-background] rounded-lg p-4 w-full"
        />

        <textarea
          name="content"
          placeholder="内容"
          required
          class="bg-[--color-background] rounded-lg p-4 mt-2 w-full h-80 resize-none"
        ></textarea>

        <button
          type="submit"
          class="bg-[--color-accent] text-white rounded-lg p-4 mt-2 w-full"
        >
          送信
        </button>
      </form>
    </div>
  );
};

export default Form;
