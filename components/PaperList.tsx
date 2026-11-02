import type { QuestionPaper } from "@/lib/quiz";
import type { PaperProblem } from "@/lib/papers";
import styles from "./quiz.module.css";

type Props = {
  papers: QuestionPaper[];
  problems: PaperProblem[];
  onSelect: (paper: QuestionPaper) => void;
};

export default function PaperList({ papers, problems, onSelect }: Props) {
  return (
    <section className={styles.card}>
      <h1 className={styles.title}>문제풀이</h1>
      {papers.length > 0 ? (
        <>
          <p className={styles.text}>풀고 싶은 문제지를 고르세요.</p>
          <ul className={styles.paperList}>
            {papers.map((paper, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={styles.paperButton}
                  onClick={() => onSelect(paper)}
                >
                  {paper.title}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className={styles.text}>아직 준비된 문제지가 없습니다.</p>
      )}
      {problems.length > 0 && (
        <div className={styles.problems}>
          {problems.map((p) => (
            <p key={p.fileName}>
              {p.fileName} 파일을 열 수 없습니다: {p.error}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
