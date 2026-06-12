# Level 3 · ORDER BY, LIMIT, DISTINCT

Filtering trims rows. Now we want to *organize* what's left — sort it, pick the first N, or collapse duplicates.

## `ORDER BY`

Sort by one or more columns:

```sql
SELECT title, rating FROM books ORDER BY rating;
```

That's ascending by default. Add `DESC` to flip it:

```sql
SELECT title, rating FROM books ORDER BY rating DESC;
```

## Multiple columns — ties broken left to right

```sql
SELECT title, year, rating FROM books
ORDER BY rating DESC, year ASC;
```

Highest rating first; books with the same rating get sorted by year.

## `LIMIT` — keep only the first N

```sql
SELECT title FROM books ORDER BY rating DESC LIMIT 5;
```

Always combine `LIMIT` with `ORDER BY`. Without ordering, the database picks "the first N rows it happened to find" — unspecified and not reproducible.

## `OFFSET` — skip the first M

For pagination:

```sql
SELECT title FROM books ORDER BY year DESC LIMIT 10 OFFSET 10;
-- rows 11–20 of the newest-first list
```

## `DISTINCT` — collapse duplicates

`DISTINCT` keeps only unique combinations of the selected columns:

```sql
SELECT DISTINCT genre FROM books;
-- one row per genre
```

If you select multiple columns, `DISTINCT` looks at the *combination*:

```sql
SELECT DISTINCT author, genre FROM books;
-- one row per (author, genre) pair
```

## A subtle thing: `ORDER BY` runs *after* `SELECT`

You can order by an alias or even by a column that isn't in the output:

```sql
SELECT title FROM books ORDER BY rating DESC;   -- rating isn't shown but is used for ordering
```

This will trip you up later when you start using `GROUP BY` and need to reach for `HAVING` — but that's Level 5.

## Try it →

Same `books` table. Run the examples, then take on the challenges.
