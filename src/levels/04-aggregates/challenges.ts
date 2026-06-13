import type { Challenge } from "../types";

export const challenges: Challenge[] = [
  {
    id: "total-books",
    prompt: "Return the **total number of books**. Single column, single row — alias it as **`total`**.",
    hints: ["`COUNT(*)` counts rows.", "`SELECT COUNT(*) AS total FROM books;`"],
    solution: "SELECT COUNT(*) AS total FROM books;",
    grade: { mode: "rows-exact", columns: ["total"], expectedRows: [] } as any,
  },
  {
    id: "avg-rating",
    prompt: "Return the **average rating** across all books, rounded to 2 decimals. Alias as **`avg_rating`**.",
    hints: ["`AVG(rating)` then cast with `::numeric(3,2)`.", "`SELECT AVG(rating)::numeric(3,2) AS avg_rating FROM books;`"],
    solution: "SELECT AVG(rating)::numeric(3,2) AS avg_rating FROM books;",
    grade: { mode: "rows-exact", columns: ["avg_rating"], expectedRows: [] } as any,
  },
  {
    id: "books-per-genre",
    prompt: "Return each **`genre`** and the **count** of books in it. Alias the count as **`n`**.",
    hints: ["`GROUP BY genre` + `COUNT(*)`.", "`SELECT genre, COUNT(*) AS n FROM books GROUP BY genre;`"],
    solution: "SELECT genre, COUNT(*) AS n FROM books GROUP BY genre;",
    grade: { mode: "rows-exact", columns: ["genre", "n"], expectedRows: [] } as any,
  },
  {
    id: "year-range",
    prompt: "Return the **earliest** and **latest** publication years across all books. Aliases: **`first_year`**, **`last_year`**.",
    hints: ["`MIN()` and `MAX()` in the same SELECT.", "`SELECT MIN(year) AS first_year, MAX(year) AS last_year FROM books;`"],
    solution: "SELECT MIN(year) AS first_year, MAX(year) AS last_year FROM books;",
    grade: { mode: "rows-exact", columns: ["first_year", "last_year"], expectedRows: [] } as any,
  },
  {
    id: "pages-per-author",
    prompt: "For each **author**, return the **total pages they've written across all their books**. Columns: **`author`**, **`total_pages`**. Order by `total_pages` descending.",
    hints: ["`GROUP BY author` + `SUM(pages)`.", "`ORDER BY total_pages DESC` at the end."],
    solution: "SELECT author, SUM(pages) AS total_pages FROM books GROUP BY author ORDER BY total_pages DESC;",
    grade: { mode: "rows-ordered", columns: ["author", "total_pages"], expectedRows: [] } as any,
  },
];

export { resolveExpected } from "../types";
