import type { GradeSpec } from "../../lib/grader";

export interface Challenge {
  id: string;
  prompt: string;
  starter?: string;
  hints: string[];
  solution: string;
  grade: GradeSpec;
}

export const challenges: Challenge[] = [
  {
    id: "all-titles",
    prompt: "Return just the **`title`** column for every book.",
    starter: "SELECT ___ FROM books;",
    hints: ["You only need one column.", "`SELECT title FROM books;`"],
    solution: "SELECT title FROM books;",
    grade: {
      mode: "rows-exact",
      columns: ["title"],
      // We grade against the same query — output count + values must match. Generated lazily below.
      expectedRows: [],
    } as any, // placeholder — see below
  },
  {
    id: "title-and-author",
    prompt: "Return the **`title`** and **`author`** of every book.",
    hints: ["Comma-separate the two column names."],
    solution: "SELECT title, author FROM books;",
    grade: {
      mode: "rows-exact",
      columns: ["title", "author"],
      expectedRows: [],
    } as any,
  },
  {
    id: "alias-published",
    prompt: "Return the **`year`** column, but alias it as **`published_in`**. Output one column only.",
    hints: ["Use the `AS` keyword.", "`SELECT year AS published_in FROM books;`"],
    solution: "SELECT year AS published_in FROM books;",
    grade: {
      mode: "rows-exact",
      columns: ["published_in"],
      expectedRows: [],
    } as any,
  },
];

// Self-grading: each challenge's `expectedRows` is computed at runtime by executing the
// solution against the live database. This avoids hard-coding 50 rows × 3 challenges
// and means any seed-data changes propagate automatically.
export async function resolveExpected(c: Challenge, runQuery: (sql: string) => Promise<any>) {
  const res = await runQuery(c.solution);
  if (res.ok) (c.grade as any).expectedRows = res.rows;
}
