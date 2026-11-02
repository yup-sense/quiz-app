"use client";

import { useState } from "react";
import type { Question, QuestionPaper } from "@/lib/quiz";
import type { PaperProblem } from "@/lib/papers";
import PaperList from "./PaperList";
import ReadyStep from "./ReadyStep";
import QuestionStep from "./QuestionStep";
import ResultStep from "./ResultStep";

// 화면 순서: 문제지 목록 → 문항 확인 → 한 문제씩 풀이 → 결과
type Stage = "list" | "ready" | "solving" | "result";

type Props = {
  papers: QuestionPaper[];
  problems: PaperProblem[];
};

export default function QuizApp({ papers, problems }: Props) {
  const [stage, setStage] = useState<Stage>("list");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);

  const current = answers.length;

  function handleSelect(paper: QuestionPaper) {
    setQuestions(paper.questions);
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
    <>
      {stage === "list" && (
        <PaperList papers={papers} problems={problems} onSelect={handleSelect} />
      )}
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
    </>
  );
}
