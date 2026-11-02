import styles from "./quiz.module.css";

type Props = {
  total: number;
  onStart: () => void;
};

export default function ReadyStep({ total, onStart }: Props) {
  return (
    <section className={styles.card}>
      <h1 className={styles.title}>총 {total}문항입니다</h1>
      <p className={`${styles.text} ${styles.muted}`}>
        한 문제씩 답을 고른 뒤, 마지막에 한 번에 채점합니다.
      </p>
      <button type="button" className={styles.button} onClick={onStart}>
        풀기 시작
      </button>
    </section>
  );
}
