import { loadQuestionPapers } from "@/lib/papers";
import QuizApp from "@/components/QuizApp";
import styles from "./page.module.css";

export default function Home() {
  // question-papers 폴더의 문제지를 읽어 화면에 넘긴다.
  const { papers, problems } = loadQuestionPapers();

  return (
    <main className={styles.main}>
      <QuizApp papers={papers} problems={problems} />
    </main>
  );
}
