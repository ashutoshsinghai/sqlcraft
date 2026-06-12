# Level 2 · Filtering with WHERE

A `SELECT` without filters returns *every* row. Often that's too much. The **`WHERE`** clause keeps only rows that match a condition.

## The basic shape

```sql
SELECT title, year FROM books WHERE year > 2000;
```

That reads: *"for each row in `books`, keep it only if `year > 2000`."*

## Comparison operators

```sql
SELECT title FROM books WHERE rating = 4.5;       -- equal
SELECT title FROM books WHERE rating <> 4.5;      -- not equal (!= also works)
SELECT title FROM books WHERE pages < 200;        -- less than
SELECT title FROM books WHERE year >= 1950;       -- at least
```

## Combining conditions

Use **`AND`** and **`OR`**. `AND` is checked before `OR`, so wrap with parentheses when mixing:

```sql
SELECT title FROM books
WHERE genre = 'Fantasy' AND rating > 4.4;

SELECT title FROM books
WHERE genre = 'Sci-Fi' OR genre = 'Fantasy';
```

## `IN` — match any of a list

```sql
SELECT title FROM books
WHERE genre IN ('Sci-Fi', 'Fantasy', 'Dystopian');
```

Cleaner than chaining `OR`s.

## `BETWEEN` — range check

```sql
SELECT title FROM books WHERE year BETWEEN 1900 AND 1950;
```

Inclusive on both ends.

## `LIKE` — pattern match

`%` matches any number of characters, `_` matches exactly one:

```sql
SELECT title FROM books WHERE title LIKE 'The %';   -- starts with "The "
SELECT title FROM books WHERE author LIKE '%Tolstoy%';
```

For case-insensitive matching, Postgres lets you use `ILIKE`:

```sql
SELECT title FROM books WHERE title ILIKE '%gatsby%';
```

## `NULL` — the absence of a value

`NULL` is special — it's not equal to anything, not even to itself. So `WHERE column = NULL` **always returns no rows**, even for rows that are actually NULL. You have to write:

```sql
SELECT title FROM books WHERE pages IS NULL;
SELECT title FROM books WHERE pages IS NOT NULL;
```

This trips up everyone the first time.

## Try it →

Same `books` table you used in Level 1. Same 50 rows. Run the examples above with **▶ Try**, then take on the challenges.
