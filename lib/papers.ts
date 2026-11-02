// question-papers 폴더의 문제지 파일을 읽는다. 서버에서만 쓴다.

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseQuestionPaper, type QuestionPaper } from "./quiz.ts";

export type PaperFile = {
  fileName: string;
  text: string;
};

export type PaperProblem = {
  fileName: string;
  error: string;
};

export type LoadedPapers = {
  papers: QuestionPaper[];
  problems: PaperProblem[]; // 형식이 잘못되어 목록에서 뺀 파일
};

// 파일 이름 순으로 정렬하고(숫자는 크기대로: 2가 10보다 앞), 형식이 맞는 파일만 목록에 넣는다.
export function parsePaperFiles(files: PaperFile[]): LoadedPapers {
  const sorted = files
    .filter((f) => f.fileName.toLowerCase().endsWith(".json"))
    .sort((a, b) => a.fileName.localeCompare(b.fileName, "ko", { numeric: true }));

  const papers: QuestionPaper[] = [];
  const problems: PaperProblem[] = [];
  for (const { fileName, text } of sorted) {
    const result = parseQuestionPaper(text);
    if (result.ok) {
      papers.push(result.paper);
    } else {
      problems.push({ fileName, error: result.error });
    }
  }
  return { papers, problems };
}

export function loadQuestionPapers(): LoadedPapers {
  // 경로를 question-papers 폴더로 고정해 두어야 배포할 때 이 폴더만 함께 포함된다.
  let fileNames: string[];
  try {
    fileNames = readdirSync(path.join(process.cwd(), "question-papers"));
  } catch {
    return { papers: [], problems: [] };
  }
  return parsePaperFiles(
    fileNames
      .filter((name) => name.toLowerCase().endsWith(".json"))
      .map((fileName) => ({
        fileName,
        text: readFileSync(path.join(process.cwd(), "question-papers", fileName), "utf8"),
      })),
  );
}
