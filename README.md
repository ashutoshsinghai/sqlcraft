# sqlcraft

A browser-based, level-by-level SQL learning platform. Run real Postgres queries against curated datasets without installing anything — Postgres itself runs *in your browser* via [PGlite](https://pglite.dev).

**🔗 Live: [sqlcraft.netlify.app](https://sqlcraft.netlify.app)** *(deploy in progress)*

## What makes it different

Most SQL tutorials run in a toy in-memory engine that supports a subset of SQL. sqlcraft uses **real Postgres** — `EXPLAIN`, window functions, recursive CTEs, JSON operators, full-text search, even contrib extensions (`pg_trgm`, `fuzzystrmatch`, `pgcrypto`, etc.). Everything runs locally in your browser; nothing leaves your machine.

- **Zero backend** — completely static, free to host, free forever to use
- **Real Postgres** — same engine as production, just compiled to WASM
- **Level-by-level progression** with concept → examples → challenges → free-play structure
- **Different dataset per level** — books for `SELECT`, e-commerce orders for aggregates, NYC taxi for window functions, etc. Datasets match the concept being taught.
- **Auto-graded challenges** — write a query, get instant pass/fail feedback against expected results
- **Persistent** — saved scripts, progress, and database state live in your browser's IndexedDB. Export anytime.
- **Settings → enable Postgres extensions** — opt in to `pg_trgm`, `fuzzystrmatch`, `pgcrypto`, `hstore`, `ltree`, `tablefunc`, `cube`, `earthdistance`, etc.

## Stack

- **PGlite** — Postgres compiled to WebAssembly, persisted to IndexedDB
- **SolidJS** + **Vite** + **TypeScript** + **Tailwind**
- **CodeMirror 6** with Postgres-dialect autocomplete pulling from your live schema
- **Dexie** for typed IndexedDB access (saved scripts + per-level progress)
- **marked** for in-app markdown lesson rendering

## Run locally

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build

```bash
npm run build
# → static site in dist/
```

## Deploy

`netlify.toml` is preconfigured. Connect this repo to Netlify (or fork it and connect yours) and pushes auto-deploy. Or deploy `dist/` manually anywhere static — Vercel, GitHub Pages, S3, Cloudflare Pages.

## Repo structure

```
src/
├── lib/
│   ├── db.ts                # PGlite singleton + queries
│   ├── extensions.ts        # Catalog of optional Postgres extensions
│   ├── storage.ts           # IndexedDB (Dexie) + localStorage wrappers
│   └── grader.ts            # Auto-grading: compares query output to expected
├── components/
│   ├── Editor.tsx           # CodeMirror SQL editor with schema-aware autocomplete
│   ├── ResultsTable.tsx     # Query results pane
│   ├── SchemaSidebar.tsx    # Tables & columns of the current dataset
│   ├── ScriptsSidebar.tsx   # Saved scripts (CRUD against IndexedDB)
│   ├── SettingsPanel.tsx    # Extensions, export data
│   ├── LessonPane.tsx       # Markdown lesson + challenges
│   └── LevelList.tsx        # Left-rail level navigation with progress dots
├── levels/
│   ├── index.ts             # Level registry
│   └── 01-books/            # Level 1 — fully built
│       ├── seed.sql
│       ├── lesson.md
│       └── challenges.ts
└── App.tsx
```

## Roadmap

Built: **Level 1 — SELECT basics (Books)**.

Sketched (datasets + concepts decided, content TBD):

| Level | Concept | Dataset |
|---|---|---|
| 2 | `WHERE`, `LIKE`, `IN`, `BETWEEN` | Books (cont.) |
| 3 | `ORDER BY`, `LIMIT`, `DISTINCT` | Top songs |
| 4 | Aggregates: `COUNT`, `SUM`, `AVG`, `GROUP BY` | E-commerce orders |
| 5 | `HAVING`, multi-column GROUP BY | E-commerce orders |
| 6 | INNER, LEFT, RIGHT, FULL JOINs | Movies + actors |
| 7 | Multi-table & self-joins | Movies + actors |
| 8 | Subqueries, `EXISTS`, `IN (SELECT ...)` | Pokemon |
| 9 | CTEs (`WITH`) | NYC taxi |
| 10 | Window functions | NYC taxi |
| 11 | Recursive CTEs | Pokemon evolutions |
| 12 | JSON & arrays | GitHub events |
| 13 | Full-text search | Recipes |

## License

MIT — see [LICENSE](LICENSE).
