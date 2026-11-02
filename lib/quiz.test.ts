import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { formatScore, gradeQuiz, parseQuizFile } from "./quiz.ts";

const validQuestion = {
  question: "문제",
  options: ["가", "나", "다", "라"],
  correctAnswer: 2,
  explanation: "해설",
};

function fileWith(questions: unknown) {
  return JSON.stringify({ questions });
}

function errorOf(text: string) {
  const result = parseQuizFile(text);
  assert.equal(result.ok, false);
  return result.ok ? "" : result.error;
}

test("점수 표시", () => {
  assert.equal(formatScore(10, 10), "100점");
  assert.equal(formatScore(2, 3), "66.7점");
  assert.equal(formatScore(0, 10), "0.0점");
  assert.equal(formatScore(1, 8), "12.5점");
  assert.equal(formatScore(7, 10), "70.0점");
});

test("정답 번호는 1부터 센다", () => {
  const q = { ...validQuestion, correctAnswer: 1 };
  const graded = gradeQuiz([q, q], [1, 2]);
  assert.deepEqual(
    graded.results.map((r) => r.isCorrect),
    [true, false],
  );
  assert.equal(graded.correctCount, 1);
  assert.equal(graded.total, 2);
});

test("예시 문제 파일을 그대로 읽는다", () => {
  const text = readFileSync(new URL("../sample-questions.json", import.meta.url), "utf8");
  const result = parseQuizFile(text);
  assert.ok(result.ok);
  assert.equal(result.questions.length, 10);
});

test("잘못된 파일은 쉬운 오류 문구를 돌려준다", () => {
  assert.match(errorOf("{ 이건 JSON이 아님"), /JSON 문제 파일인지/);
  assert.match(errorOf("{}"), /문제 목록\(questions\)/);
  assert.match(errorOf(fileWith([])), /문제가 하나도 없습니다/);
  assert.match(
    errorOf(fileWith([validQuestion, { ...validQuestion, options: ["가", "나", "다"] }])),
    /^2번 문제의 보기\(options\)가 4개가 아닙니다/,
  );
  assert.match(errorOf(fileWith([{ ...validQuestion, correctAnswer: 5 }])), /정답 번호/);
  assert.match(errorOf(fileWith([{ ...validQuestion, correctAnswer: "2" }])), /정답 번호/);
  assert.match(errorOf(fileWith([{ ...validQuestion, question: "" }])), /내용\(question\)/);
  assert.match(errorOf(fileWith([{ ...validQuestion, explanation: " " }])), /해설/);
});
