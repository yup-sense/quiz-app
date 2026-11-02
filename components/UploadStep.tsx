"use client";

import { useState, type ChangeEvent } from "react";
import { parseQuizFile, type Question } from "@/lib/quiz";
import styles from "./quiz.module.css";

type Props = {
  onLoaded: (questions: Question[]) => void;
};

export default function UploadStep({ onLoaded }: Props) {
  const [error, setError] = useState("");

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    // 같은 파일을 고쳐서 다시 골라도 다시 읽히도록 비워 둔다.
    input.value = "";
    if (!file) return;

    let text: string;
    try {
      text = await file.text();
    } catch {
      setError("파일을 열 수 없습니다. 다른 파일을 골라 주세요.");
      return;
    }

    const result = parseQuizFile(text);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    onLoaded(result.questions);
  }

  return (
    <section className={styles.card}>
      <h1 className={styles.title}>문제풀이</h1>
      <p className={styles.text}>선생님께 받은 문제 파일(JSON)을 올려 주세요.</p>
      <label className={styles.button}>
        문제 파일 선택
        <input
          className={styles.fileInput}
          type="file"
          accept=".json,application/json"
          onChange={handleChange}
        />
      </label>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
