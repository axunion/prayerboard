import { type Component, createSignal, createEffect, Show } from "solid-js";

const keyframes = {
  fadeIn: [
    { opacity: 0, transform: "scale(0.95)" },
    { opacity: 1, transform: "scale(1)" },
  ],

  fadeOut: [
    { opacity: 1, transform: "scale(1)" },
    { opacity: 0, transform: "scale(0.95)" },
  ],
};

const options = {
  fadeIn: {
    duration: 250,
  },
  fadeOut: {
    duration: 250,
  },
};

const Post: Component = () => {
  const [isOpen, setIsOpen] = createSignal<boolean>(false);
  const toggle = () => setIsOpen(!isOpen());
  const stopPropagation = (e: Event) => e.stopPropagation();
  let form: HTMLFormElement | undefined;

  const submit = (e: Event) => {
    e.preventDefault();
    console.log("submit");
  };

  createEffect(() => {
    if (isOpen()) {
      form?.animate(keyframes.fadeIn, options.fadeIn);
    } else {
      form?.animate(keyframes.fadeOut, options.fadeOut);
    }
  });

  return (
    <>
      <button
        class="bg-[--color-accent] text-white rounded-full h-12 w-12 p-2 shadow-lg"
        onClick={toggle}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M6.93912 14.0328C6.7072 14.6563 6.51032 15.2331 6.33421 15.8155C7.29345 15.1189 8.43544 14.6767 9.75193 14.5121C12.2652 14.198 14.4976 12.5385 15.6279 10.4537L14.1721 8.99888L15.5848 7.58417C15.9185 7.25004 16.2521 6.91614 16.5858 6.58248C17.0151 6.15312 17.5 5.35849 18.0129 4.2149C12.4197 5.08182 8.99484 8.50647 6.93912 14.0328ZM17 8.99739L18 9.99669C17 12.9967 14 15.9967 10 16.4967C7.33146 16.8303 5.66421 18.6636 4.99824 21.9967H3C4 15.9967 6 1.99669 21 1.99669C20.0009 4.99402 19.0018 6.99313 18.0027 7.99402C17.6662 8.33049 17.3331 8.66382 17 8.99739Z"></path>
        </svg>
      </button>

      <Show when={isOpen()}>
        <div
          class="bg-black/50 backdrop-blur-sm fixed inset-0 flex flex-col justify-center items-center p-4"
          onClick={toggle}
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
              class="bg-[--color-background] rounded-lg p-4 w-full"
            />

            <textarea
              name="content"
              placeholder="祈りの課題"
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
      </Show>
    </>
  );
};

export default Post;
