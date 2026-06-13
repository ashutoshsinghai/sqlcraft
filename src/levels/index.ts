// Level registry. Each level bundles a seed, a lesson markdown, and challenges.
import seed01 from "./01-books/seed.sql?raw";
import lesson01 from "./01-books/lesson.md?raw";
import { challenges as challenges01 } from "./01-books/challenges";

import seed02 from "./02-where/seed.sql?raw";
import lesson02 from "./02-where/lesson.md?raw";
import { challenges as challenges02 } from "./02-where/challenges";

import seed03 from "./03-order-limit/seed.sql?raw";
import lesson03 from "./03-order-limit/lesson.md?raw";
import { challenges as challenges03 } from "./03-order-limit/challenges";

import seed04 from "./04-aggregates/seed.sql?raw";
import lesson04 from "./04-aggregates/lesson.md?raw";
import { challenges as challenges04 } from "./04-aggregates/challenges";

import seed05 from "./05-having/seed.sql?raw";
import lesson05 from "./05-having/lesson.md?raw";
import { challenges as challenges05 } from "./05-having/challenges";

import type { Challenge } from "./types";
export { resolveExpected } from "./types";
export type { Challenge };

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
  sentinelTable?: string; // table whose presence indicates this level's seed has already run
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
    sentinelTable: "books",
  },
  {
    id: "02-where",
    title: "Level 2 · WHERE & filters",
    subtitle: "Books (cont.)",
    concept: "WHERE, AND/OR, IN, BETWEEN, LIKE, NULL",
    dataset: "books (50 rows, reused)",
    seed: seed02,
    lesson: lesson02,
    challenges: challenges02,
    available: true,
    sentinelTable: "books",
  },
  {
    id: "03-order-limit",
    title: "Level 3 · ORDER BY & LIMIT",
    subtitle: "Books (cont.)",
    concept: "ORDER BY, LIMIT, OFFSET, DISTINCT",
    dataset: "books (50 rows, reused)",
    seed: seed03,
    lesson: lesson03,
    challenges: challenges03,
    available: true,
    sentinelTable: "books",
  },
  {
    id: "04-aggregates",
    title: "Level 4 · Aggregates & GROUP BY",
    subtitle: "Books (cont.)",
    concept: "COUNT, SUM, AVG, MIN, MAX, GROUP BY",
    dataset: "books (50 rows, reused)",
    seed: seed04,
    lesson: lesson04,
    challenges: challenges04,
    available: true,
    sentinelTable: "books",
  },
  {
    id: "05-having",
    title: "Level 5 · HAVING",
    subtitle: "Books (cont.)",
    concept: "HAVING, WHERE vs HAVING, query execution order",
    dataset: "books (50 rows, reused)",
    seed: seed05,
    lesson: lesson05,
    challenges: challenges05,
    available: true,
    sentinelTable: "books",
  },
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

export function getNextAvailableLevel(currentId: string): Level | undefined {
  const idx = LEVELS.findIndex((l) => l.id === currentId);
  if (idx === -1) return undefined;
  for (let i = idx + 1; i < LEVELS.length; i++) {
    if (LEVELS[i].available) return LEVELS[i];
  }
  return undefined;
}
