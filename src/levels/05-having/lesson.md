# Level 5 · HAVING — filtering groups

In Level 4 you learned how to aggregate per group. Now: *"only show me groups that meet a condition."* That's `HAVING`.

## `WHERE` vs `HAVING` — when to use which

A SQL query roughly executes in this order:

1. `FROM` — pick the table
2. `WHERE` — filter individual rows (before grouping)
3. `GROUP BY` — bucket the surviving rows into groups
4. `HAVING` — filter groups (after grouping)
5. `SELECT` — project the result
6. `ORDER BY` — sort
7. `LIMIT` — cap

`WHERE` runs on raw rows. `HAVING` runs on groups after aggregation. **They're not interchangeable.**

```sql
-- "Genres with more than 5 books"
SELECT genre, COUNT(*) AS n
FROM books
GROUP BY genre
HAVING COUNT(*) > 5;
```

You can't write `WHERE COUNT(*) > 5` — `WHERE` runs before grouping, when there are no groups yet.

## Aggregate inside HAVING

`HAVING` clauses almost always reference an aggregate:

```sql
SELECT author, AVG(rating) AS avg_r
FROM books
GROUP BY author
HAVING AVG(rating) > 4.2;
```

You can reference the column directly even though it's the result of `AVG`. You can also reuse the alias in Postgres (some other databases don't allow this):

```sql
SELECT author, AVG(rating) AS avg_r
FROM books
GROUP BY author
HAVING avg_r > 4.2;
```

## Combining WHERE + HAVING

You'll often want both: filter rows first, then aggregate, then filter the groups.

```sql
-- "Among books published after 1900, which genres have more than 3 books?"
SELECT genre, COUNT(*) AS n
FROM books
WHERE year > 1900       -- runs first, on raw rows
GROUP BY genre
HAVING COUNT(*) > 3;    -- runs after grouping
```

This pattern — `WHERE` then `GROUP BY` then `HAVING` — is the workhorse of analytics queries.

## Multiple HAVING conditions

Like `WHERE`, you combine with `AND` / `OR`:

```sql
SELECT genre, COUNT(*) AS n, AVG(rating) AS avg_r
FROM books
GROUP BY genre
HAVING COUNT(*) > 3 AND AVG(rating) > 4.0;
```

## Try it →

Same `books` table. Run the examples, then take on the challenges.
