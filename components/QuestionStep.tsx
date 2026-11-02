"use client";

import { useState } from "react";
import type { Question } from "@/lib/quiz";
import styles from "./quiz.module.css";

type Props = {
  number: number; // 1부터
  question: Question;
  isLast: boolean;
  onAnswer: (selected: number) => void;
};

// 문제가 바뀔 때 고른 답이 비워지도록, 부모가 key로 문제 번호를 넘긴다.
export default function QuestionStep({ number, question, isLast, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className={styles.card}>
      <p className={styles.questionNumber}>{number}번 문제</p>
      <h1 className={styles.question}>{question.question}</h1>
      <fieldset className={styles.options}>
        <legend className={styles.srOnly}>보기를 하나 고르세요</legend>
        {question.options.map((option, i) => {
          const value = i + 1;
          return (
            <label
              key={value}
              className={`${styles.option} ${selected === value ? styles.optionSelected : ""}`}
            >
              <input
                type="radio"
                name={`question-${number}`}
                checked={selected === value}
                onChange={() => setSelected(value)}
              />
              <span>
                {value}. {option}
              </span>
            </label>
          );
        })}
      </fieldset>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.button}
          disabled={selected === null}
          onClick={() => selected !== null && onAnswer(selected)}
        >
          {isLast ? "채점하기" : "다음"}
        </button>
      </div>
    </section>
  );
}
