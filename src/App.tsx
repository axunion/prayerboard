import { createSignal, type Component } from "solid-js";
import Board from "./components/Board";
import Post from "./components/Post";

const App: Component = () => {
  const [date, setDate] = createSignal<string>("");

  setTimeout(() => {
    setDate("2024-02-09");
  }, 1000);

  return (
    <>
      <div class="fixed inset-x-0 top-0 h-12 bg-[--color-primary] text-[--color-background] font-mono flex justify-center items-center">
        {date()}
      </div>

      <div class="py-12">
        <Board />
      </div>

      <div class="fixed bottom-4 right-4">
        <Post />
      </div>
    </>
  );
};

export default App;
