"use client";

import { useState } from "react";
import type { Question } from "@/lib/quiz";
import UploadStep from "@/components/UploadStep";
import ReadyStep from "@/components/ReadyStep";
import QuestionStep from "@/components/QuestionStep";
import ResultStep from "@/components/ResultStep";
import styles from "./page.module.css";

// 화면 순서: 파일 올리기 → 문항 확인 → 한 문제씩 풀이 → 결과
type Stage = "upload" | "ready" | "solving" | "result";

export default function Home() {
  const [stage, setStage] = useState<Stage>("upload");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);

  const current = answers.length;

  function handleLoaded(loaded: Question[]) {
    setQuestions(loaded);
    setAnswers([]);
    setStage("ready");
  }

  function handleAnswer(selected: number) {
    const next = [...answers, selected];
    setAnswers(next);
    if (next.length === questions.length) {
      setStage("result");
    }
  }

  return (
    <main className={styles.main}>
      {stage === "upload" && <UploadStep onLoaded={handleLoaded} />}
      {stage === "ready" && (
        <ReadyStep total={questions.length} onStart={() => setStage("solving")} />
      )}
      {stage === "solving" && (
        <QuestionStep
          key={current}
          number={current + 1}
          question={questions[current]}
          isLast={current === questions.length - 1}
          onAnswer={handleAnswer}
        />
      )}
      {stage === "result" && <ResultStep questions={questions} answers={answers} />}
    </main>
  );
}
