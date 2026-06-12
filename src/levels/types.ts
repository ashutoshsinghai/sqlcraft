import type { GradeSpec } from "../lib/grader";

export interface Challenge {
  id: string;
  prompt: string;
  starter?: string;
  hints: string[];
  solution: string;
  grade: GradeSpec;
}

export async function resolveExpected(c: Challenge, runQuery: (sql: string) => Promise<any>) {
  const res = await runQuery(c.solution);
  if (res.ok) (c.grade as any).expectedRows = res.rows;
}
