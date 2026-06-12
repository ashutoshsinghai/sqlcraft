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
    id: "post-2000",
    prompt: "Find the **titles** of books published in or after **2000**.",
    hints: ["Use a comparison on the `year` column.", "`WHERE year >= 2000`"],
    solution: "SELECT title FROM books WHERE year >= 2000;",
    grade: { mode: "rows-exact", columns: ["title"], expectedRows: [] } as any,
  },
  {
    id: "fantasy-high-rated",
    prompt: "Find the **title** and **rating** of all **Fantasy** books rated **above 4.4**.",
    hints: ["Filter on `genre` and `rating` with `AND`.", "`WHERE genre = 'Fantasy' AND rating > 4.4`"],
    solution: "SELECT title, rating FROM books WHERE genre = 'Fantasy' AND rating > 4.4;",
    grade: { mode: "rows-exact", columns: ["title", "rating"], expectedRows: [] } as any,
  },
  {
    id: "speculative-fiction",
    prompt: "Find the **title** and **genre** of every book in **Sci-Fi**, **Fantasy**, *or* **Dystopian**. Use `IN`.",
    hints: ["`WHERE genre IN ('Sci-Fi', 'Fantasy', 'Dystopian')`"],
    solution: "SELECT title, genre FROM books WHERE genre IN ('Sci-Fi', 'Fantasy', 'Dystopian');",
    grade: { mode: "rows-exact", columns: ["title", "genre"], expectedRows: [] } as any,
  },
  {
    id: "tolstoy",
    prompt: "Find the **title** of every book whose **author contains 'Tolstoy'**. Use `LIKE`.",
    hints: ["`%` matches any number of characters.", "`WHERE author LIKE '%Tolstoy%'`"],
    solution: "SELECT title FROM books WHERE author LIKE '%Tolstoy%';",
    grade: { mode: "rows-exact", columns: ["title"], expectedRows: [] } as any,
  },
  {
    id: "19th-century",
    prompt: "Find the **title** and **year** of books published in the **19th century** (1800–1899 inclusive). Use `BETWEEN`.",
    hints: ["`BETWEEN` is inclusive on both ends.", "`WHERE year BETWEEN 1800 AND 1899`"],
    solution: "SELECT title, year FROM books WHERE year BETWEEN 1800 AND 1899;",
    grade: { mode: "rows-exact", columns: ["title", "year"], expectedRows: [] } as any,
  },
];

export async function resolveExpected(c: Challenge, runQuery: (sql: string) => Promise<any>) {
  const res = await runQuery(c.solution);
  if (res.ok) (c.grade as any).expectedRows = res.rows;
}
