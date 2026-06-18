import styles from "./Note.module.css";

type Props = {
  name: string;
  content: string;
};

export default function Note(props: Props) {
  return (
    <article class={styles.note}>
      <header class={styles.header}>
        <span class={styles.name}>{props.name}</span>
      </header>
      <p class={styles.content}>{props.content}</p>
    </article>
  );
}
