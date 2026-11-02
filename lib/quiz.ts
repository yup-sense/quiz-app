// 문제 파일 검사, 채점, 점수 표시 규칙.
// 화면과 분리해 두어, 나중에 다른 곳에서 온 문제도 같은 규칙으로 처리할 수 있게 한다.

export type Question = {
  question: string;
  options: string[]; // 항상 4개
  correctAnswer: number; // 1~4, 1이면 options의 첫 번째 보기
  explanation: string;
};

export type ParseResult =
  | { ok: true; questions: Question[] }
  | { ok: false; error: string };

export type QuestionResult = {
  selected: number; // 1~4
  isCorrect: boolean;
};

export type GradeResult = {
  results: QuestionResult[];
  correctCount: number;
  total: number;
};

const OPTION_COUNT = 4;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

export function parseQuizFile(text: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return {
      ok: false,
      error: "파일을 읽을 수 없습니다. JSON 문제 파일인지 확인해 주세요.",
    };
  }

  const list =
    typeof data === "object" && data !== null
      ? (data as { questions?: unknown }).questions
      : undefined;
  if (!Array.isArray(list)) {
    return {
      ok: false,
      error:
        "파일에서 문제 목록(questions)을 찾을 수 없습니다. 선생님께 받은 문제 파일인지 확인해 주세요.",
    };
  }
  if (list.length === 0) {
    return { ok: false, error: "파일에 문제가 하나도 없습니다." };
  }

  const questions: Question[] = [];
  for (let i = 0; i < list.length; i++) {
    const n = i + 1;
    const item = list[i] as Record<string, unknown> | null;
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      return { ok: false, error: `${n}번 문제의 형식이 올바르지 않습니다.` };
    }
    if (!isNonEmptyString(item.question)) {
      return { ok: false, error: `${n}번 문제의 내용(question)이 비어 있습니다.` };
    }
    if (!Array.isArray(item.options) || item.options.length !== OPTION_COUNT) {
      return { ok: false, error: `${n}번 문제의 보기(options)가 4개가 아닙니다.` };
    }
    if (!item.options.every(isNonEmptyString)) {
      return { ok: false, error: `${n}번 문제의 보기 중 비어 있는 것이 있습니다.` };
    }
    const answer = item.correctAnswer;
    if (
      typeof answer !== "number" ||
      !Number.isInteger(answer) ||
      answer < 1 ||
      answer > OPTION_COUNT
    ) {
      return {
        ok: false,
        error: `${n}번 문제의 정답 번호(correctAnswer)는 1~4 중 하나여야 합니다.`,
      };
    }
    if (!isNonEmptyString(item.explanation)) {
      return { ok: false, error: `${n}번 문제의 해설(explanation)이 비어 있습니다.` };
    }
    questions.push({
      question: item.question,
      options: item.options,
      correctAnswer: answer,
      explanation: item.explanation,
    });
  }

  return { ok: true, questions };
}

// answers[i]는 i번째 문항에서 고른 보기 번호(1~4).
export function gradeQuiz(questions: Question[], answers: number[]): GradeResult {
  const results = questions.map((q, i) => ({
    selected: answers[i],
    isCorrect: answers[i] === q.correctAnswer,
  }));
  return {
    results,
    correctCount: results.filter((r) => r.isCorrect).length,
    total: questions.length,
  };
}

// 정답 수 ÷ 전체 문항 수 × 100을 소수 둘째 자리에서 반올림한다.
// 100점만 "100점", 나머지는 소수 첫째 자리까지 표시한다.
export function formatScore(correctCount: number, total: number): string {
  const score = Math.round((correctCount / total) * 1000) / 10;
  return score === 100 ? "100점" : `${score.toFixed(1)}점`;
}
