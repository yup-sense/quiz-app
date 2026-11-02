import { formatScore, gradeQuiz, type Question } from "@/lib/quiz";
import styles from "./quiz.module.css";

type Props = {
  questions: Question[];
  answers: number[];
};

export default function ResultStep({ questions, answers }: Props) {
  const { results, correctCount, total } = gradeQuiz(questions, answers);

  return (
    <>
      <section className={styles.card}>
        <p className={styles.muted}>내 점수</p>
        <p className={styles.score}>{formatScore(correctCount, total)}</p>
        <p className={styles.muted}>
          {total}문제 중 {correctCount}문제를 맞혔습니다.
        </p>
      </section>

      <ol className={styles.resultList}>
        {questions.map((q, i) => {
          const { selected, isCorrect } = results[i];
          return (
            <li
              key={i}
              className={`${styles.card} ${styles.resultItem} ${
                isCorrect ? styles.resultCorrect : styles.resultWrong
              }`}
            >
              <p className={styles.questionNumber}>
                {i + 1}번 문제
                <span
                  className={`${styles.badge} ${
                    isCorrect ? styles.badgeCorrect : styles.badgeWrong
                  }`}
                >
                  {isCorrect ? "○ 맞음" : "✕ 틀림"}
                </span>
              </p>
              <p className={styles.question}>{q.question}</p>
              <p className={styles.detail}>
                <span className={styles.detailLabel}>내가 고른 답: </span>
                {selected}. {q.options[selected - 1]}
              </p>
              <p className={styles.detail}>
                <span className={styles.detailLabel}>정답: </span>
                {q.correctAnswer}. {q.options[q.correctAnswer - 1]}
              </p>
              <p className={styles.detail}>
                <span className={styles.detailLabel}>해설: </span>
                {q.explanation}
              </p>
            </li>
          );
        })}
      </ol>
    </>
  );
}
