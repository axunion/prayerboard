import styles from "./Note.module.css";

type Props = {
  name: string;
  content: string;
  createdAt: number;
};

export default function Note(props: Props) {
  const date = new Date(props.createdAt);
  return (
    <article class={styles.note}>
      <header class={styles.header}>
        <span class={styles.name}>{props.name}</span>
        <time class={styles.time} dateTime={date.toISOString()}>
          {date.toLocaleDateString("ja-JP", {
            month: "short",
            day: "numeric",
          })}
        </time>
      </header>
      <p class={styles.content}>{props.content}</p>
    </article>
  );
}
