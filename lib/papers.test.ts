import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadQuestionPapers, parsePaperFiles } from "./papers.ts";

const sampleText = readFileSync(
  new URL("../question-papers/sample-questions.json", import.meta.url),
  "utf8",
);

test("실제 question-papers 폴더의 문제지를 읽는다", () => {
  const { papers, problems } = loadQuestionPapers();
  assert.deepEqual(
    papers.map((p) => p.title),
    ["중학교 정보과목"],
  );
  assert.equal(papers[0].questions.length, 10);
  assert.deepEqual(problems, []);
});

// 여러 문제지는 파일을 만들지 않고 메모리에서만 확인한다. 기존 문제지를 복사해 title만 바꾼다.
test("여러 문제지: 파일 이름 순, 각자의 title과 문항, 잘못된 파일은 목록에서 뺌", () => {
  const sample = JSON.parse(sampleText);
  const { papers, problems } = parsePaperFiles([
    { fileName: "10-b.json", text: JSON.stringify({ ...sample, title: "두 번째" }) },
    { fileName: "2-a.json", text: sampleText },
    { fileName: "broken.json", text: JSON.stringify({ questions: sample.questions }) },
    { fileName: "notes.txt", text: "문제지가 아님" },
  ]);
  assert.deepEqual(
    papers.map((p) => p.title),
    ["중학교 정보과목", "두 번째"],
  );
  assert.deepEqual(papers[1].questions, sample.questions);
  assert.deepEqual(
    problems.map((p) => p.fileName),
    ["broken.json"],
  );
  assert.match(problems[0].error, /제목\(title\)/);
});
