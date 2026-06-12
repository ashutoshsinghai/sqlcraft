import type { Challenge } from "../types";

export const challenges: Challenge[] = [
  {
    id: "top-5-rated",
    prompt: "Return the **title** and **rating** of the **5 highest-rated books**, in descending rating order.",
    hints: ["Sort by rating descending, then limit to 5.", "`ORDER BY rating DESC LIMIT 5`"],
    solution: "SELECT title, rating FROM books ORDER BY rating DESC LIMIT 5;",
    grade: { mode: "rows-ordered", columns: ["title", "rating"], expectedRows: [] } as any,
  },
  {
    id: "oldest-3",
    prompt: "Return the **title** and **year** of the **3 oldest books**, oldest first.",
    hints: ["Ascending by year is the default; `ORDER BY year LIMIT 3` works."],
    solution: "SELECT title, year FROM books ORDER BY year ASC LIMIT 3;",
    grade: { mode: "rows-ordered", columns: ["title", "year"], expectedRows: [] } as any,
  },
  {
    id: "distinct-genres",
    prompt: "Return a list of all **distinct genres**, alphabetical.",
    hints: ["`DISTINCT` + `ORDER BY`.", "`SELECT DISTINCT genre FROM books ORDER BY genre`"],
    solution: "SELECT DISTINCT genre FROM books ORDER BY genre;",
    grade: { mode: "rows-ordered", columns: ["genre"], expectedRows: [] } as any,
  },
  {
    id: "longest-then-shortest",
    prompt: "Return the **title** and **pages** of the **3 longest books** (most pages first). Tie-break alphabetically by title if pages are equal.",
    hints: ["Two-column `ORDER BY`: pages DESC, then title ASC.", "Then `LIMIT 3`."],
    solution: "SELECT title, pages FROM books ORDER BY pages DESC, title ASC LIMIT 3;",
    grade: { mode: "rows-ordered", columns: ["title", "pages"], expectedRows: [] } as any,
  },
  {
    id: "paginate-newest",
    prompt: "Skip the **5 newest books** and return the **next 5** (by year, newest first). Show **title** and **year**.",
    hints: ["`ORDER BY year DESC` to sort newest first.", "Use `LIMIT 5 OFFSET 5` to skip 5 and take the next 5."],
    solution: "SELECT title, year FROM books ORDER BY year DESC LIMIT 5 OFFSET 5;",
    grade: { mode: "rows-ordered", columns: ["title", "year"], expectedRows: [] } as any,
  },
];

export { resolveExpected } from "../types";
