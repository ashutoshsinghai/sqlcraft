// Level registry. Each level bundles a seed, a lesson markdown, and challenges.
import seed01 from "./01-books/seed.sql?raw";
import lesson01 from "./01-books/lesson.md?raw";
import { challenges as challenges01 } from "./01-books/challenges";
import type { Challenge } from "./01-books/challenges";

export type Level = {
  id: string;
  title: string;
  subtitle: string;
  concept: string;
  dataset: string;
  seed: string;
  lesson: string;
  challenges: Challenge[];
  available: boolean;
};

export const LEVELS: Level[] = [
  {
    id: "01-books",
    title: "Level 1 · SELECT basics",
    subtitle: "Books",
    concept: "SELECT, column projection, AS alias",
    dataset: "books (50 rows)",
    seed: seed01,
    lesson: lesson01,
    challenges: challenges01,
    available: true,
  },
  // Future levels — sketches, not yet built
  { id: "02-where", title: "Level 2 · WHERE & operators", subtitle: "Books (cont.)", concept: "WHERE, LIKE, IN, BETWEEN", dataset: "books", seed: "", lesson: "", challenges: [], available: false },
  { id: "03-order-limit", title: "Level 3 · ORDER BY & LIMIT", subtitle: "Top songs", concept: "ORDER BY, LIMIT, DISTINCT", dataset: "songs", seed: "", lesson: "", challenges: [], available: false },
  { id: "04-aggregates", title: "Level 4 · Aggregates", subtitle: "E-commerce orders", concept: "COUNT, SUM, AVG, GROUP BY", dataset: "orders", seed: "", lesson: "", challenges: [], available: false },
  { id: "05-having", title: "Level 5 · GROUP BY & HAVING", subtitle: "E-commerce orders", concept: "HAVING, multi-column GROUP BY", dataset: "orders", seed: "", lesson: "", challenges: [], available: false },
  { id: "06-joins", title: "Level 6 · JOINs", subtitle: "Movies + actors", concept: "INNER, LEFT, RIGHT, FULL JOIN", dataset: "movies", seed: "", lesson: "", challenges: [], available: false },
  { id: "07-multi-join", title: "Level 7 · Multi-table joins", subtitle: "Movies + actors", concept: "self-joins, chains", dataset: "movies", seed: "", lesson: "", challenges: [], available: false },
  { id: "08-subqueries", title: "Level 8 · Subqueries", subtitle: "Pokemon", concept: "subqueries, EXISTS, IN (SELECT...)", dataset: "pokemon", seed: "", lesson: "", challenges: [], available: false },
  { id: "09-ctes", title: "Level 9 · CTEs", subtitle: "NYC taxi", concept: "WITH, named subqueries", dataset: "taxi", seed: "", lesson: "", challenges: [], available: false },
  { id: "10-window", title: "Level 10 · Window functions", subtitle: "NYC taxi", concept: "ROW_NUMBER, RANK, LAG, LEAD, running totals", dataset: "taxi", seed: "", lesson: "", challenges: [], available: false },
  { id: "11-recursive", title: "Level 11 · Recursive CTEs", subtitle: "Pokemon evolutions", concept: "WITH RECURSIVE, tree walks", dataset: "pokemon-evo", seed: "", lesson: "", challenges: [], available: false },
  { id: "12-json", title: "Level 12 · JSON & arrays", subtitle: "GitHub events", concept: "jsonb, arrays, jsonb_path_query", dataset: "gh-events", seed: "", lesson: "", challenges: [], available: false },
  { id: "13-fts", title: "Level 13 · Full-text search", subtitle: "Recipes", concept: "to_tsvector, to_tsquery, ranking", dataset: "recipes", seed: "", lesson: "", challenges: [], available: false },
];

export function getLevel(id: string): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}
