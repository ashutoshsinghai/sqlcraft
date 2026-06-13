# Level 4 · Aggregates & GROUP BY

So far each row in your output corresponded to one row in the table. Now we'll **collapse many rows into one** — counts, sums, averages.

## Aggregate functions

These take a column (or `*`) and reduce it to a single value:

```sql
SELECT COUNT(*) FROM books;            -- how many rows?
SELECT AVG(rating) FROM books;         -- average rating
SELECT MIN(year), MAX(year) FROM books;
SELECT SUM(pages) FROM books;
```

`COUNT(*)` counts rows. `COUNT(column)` counts non-NULL values in that column — sometimes a useful distinction.

## Naming the result

Aggregates produce columns with awkward auto-generated names. Always alias them:

```sql
SELECT AVG(rating) AS avg_rating FROM books;
```

## `GROUP BY` — aggregate per group

Want averages *per genre* instead of overall? Group the rows first, then aggregate within each group:

```sql
SELECT genre, AVG(rating) AS avg_rating
FROM books
GROUP BY genre;
```

Reads as: *"for each distinct value of `genre`, compute `AVG(rating)`."*

Rule: **every column in `SELECT` must either appear in `GROUP BY` or be inside an aggregate function.** Postgres will error otherwise. This trips up everyone.

## Multiple GROUP BY columns

Group by combinations:

```sql
SELECT author, genre, COUNT(*) AS books
FROM books
GROUP BY author, genre
ORDER BY books DESC;
```

One row per (author, genre) pair.

## Common patterns

```sql
-- "How many distinct values?"
SELECT COUNT(DISTINCT author) FROM books;

-- "Average per group, sorted by group size"
SELECT genre, COUNT(*) AS n, AVG(rating)::numeric(3,2) AS avg_rating
FROM books
GROUP BY genre
ORDER BY n DESC;
```

The `::numeric(3,2)` cast trims trailing decimals — Postgres averages return ugly types by default.

## Try it →

Same `books` table. Run the examples, then take on the challenges.
