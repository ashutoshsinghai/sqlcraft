# Level 1 · SELECT basics

Welcome to SQL — the language for asking databases questions.

Every SQL query starts with **`SELECT`**. You name the columns you want, you name the table to pull them from, and the database hands you back rows.

## The simplest query

```sql
SELECT title FROM books;
```

That asks: *"give me the `title` column of every row in the `books` table."*

## Multiple columns

Comma-separate them:

```sql
SELECT title, author, year FROM books;
```

## Every column

The `*` wildcard means *"all columns"*. Useful when exploring, but in real code you usually name what you need.

```sql
SELECT * FROM books;
```

## Renaming with `AS`

Sometimes a column name is awkward, or you want it labelled differently in the output:

```sql
SELECT title AS book_name, year AS published_in FROM books;
```

The `AS` keyword is optional — `SELECT title book_name FROM books` works too — but writing it explicitly makes intent obvious.

## Try it

The dataset has 50 books loaded into a table called `books`. Schema:

| column | type | example |
|---|---|---|
| `id` | int | 1 |
| `title` | text | The Great Gatsby |
| `author` | text | F. Scott Fitzgerald |
| `year` | int | 1925 |
| `pages` | int | 180 |
| `rating` | numeric | 3.9 |
| `genre` | text | Classic |

Run the examples above, then move to the challenges →
