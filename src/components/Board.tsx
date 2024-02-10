import { createSignal, For, type Component } from "solid-js";

interface BoardItem {
  id: number;
  name: string;
  description: string;
}

const BoardItem: Component<BoardItem> = (props) => {
  // const [isOpen, setIsOpen] = createSignal<boolean>(false);

  return (
    <div class="bg-white p-3 rounded-sm shadow-md">
      <div class="font-bold">{props.name}</div>
      <p>{props.description}</p>
    </div>
  );
};

const Board: Component = () => {
  const [boardItem, setBoardItem] = createSignal<BoardItem[]>([]);

  setTimeout(() => {
    const items = [
      {
        id: 1,
        name: "First",
        description: "This is the first item",
      },
      {
        id: 2,
        name: "Second",
        description: "This is the second item",
      },
      {
        id: 3,
        name: "Third",
        description: "This is the third item",
      },
      {
        id: 4,
        name: "Fourth",
        description: "This is the fourth item",
      },
    ];

    setBoardItem([...items, ...items]);
  }, 500);

  return (
    <div class="p-4 max-w-screen-md m-auto grid gap-3">
      <For each={boardItem()}>
        {(item) => (
          <BoardItem
            id={item.id}
            name={item.name}
            description={item.description}
          />
        )}
      </For>
    </div>
  );
};

export default Board;
