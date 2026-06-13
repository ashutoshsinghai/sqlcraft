import type { Challenge } from "../types";

export const challenges: Challenge[] = [
  {
    id: "popular-genres",
    prompt: "Find **genres with more than 5 books**. Return **`genre`** and the **count** as **`n`**, ordered by `n` descending.",
    hints: ["`GROUP BY genre` + `HAVING COUNT(*) > 5`."],
    solution: "SELECT genre, COUNT(*) AS n FROM books GROUP BY genre HAVING COUNT(*) > 5 ORDER BY n DESC;",
    grade: { mode: "rows-ordered", columns: ["genre", "n"], expectedRows: [] } as any,
  },
  {
    id: "prolific-authors",
    prompt: "Find **authors who wrote 2 or more books**. Return **`author`** and the **count** as **`books_written`**, ordered by count descending then author ascending.",
    hints: ["`HAVING COUNT(*) >= 2`.", "Two-key sort: `ORDER BY books_written DESC, author ASC`."],
    solution: "SELECT author, COUNT(*) AS books_written FROM books GROUP BY author HAVING COUNT(*) >= 2 ORDER BY books_written DESC, author ASC;",
    grade: { mode: "rows-ordered", columns: ["author", "books_written"], expectedRows: [] } as any,
  },
  {
    id: "high-rated-genres",
    prompt: "Find **genres with average rating above 4.0**. Return **`genre`** and **`avg_rating`** rounded to 2 decimals, ordered by `avg_rating` descending.",
    hints: ["`HAVING AVG(rating) > 4.0`.", "`AVG(rating)::numeric(3,2) AS avg_rating`."],
    solution: "SELECT genre, AVG(rating)::numeric(3,2) AS avg_rating FROM books GROUP BY genre HAVING AVG(rating) > 4.0 ORDER BY avg_rating DESC;",
    grade: { mode: "rows-ordered", columns: ["genre", "avg_rating"], expectedRows: [] } as any,
  },
  {
    id: "where-and-having",
    prompt: "Among **books published after 1900**, find **genres with at least 3 books**. Return **`genre`** and **`n`**, ordered by `n` descending.",
    hints: ["`WHERE year > 1900` filters rows; `HAVING COUNT(*) >= 3` filters groups."],
    solution: "SELECT genre, COUNT(*) AS n FROM books WHERE year > 1900 GROUP BY genre HAVING COUNT(*) >= 3 ORDER BY n DESC;",
    grade: { mode: "rows-ordered", columns: ["genre", "n"], expectedRows: [] } as any,
  },
];

export { resolveExpected } from "../types";
