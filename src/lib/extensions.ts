// Catalog of PGlite extensions exposed to users via Settings.
// Each extension has metadata + a loader fn that returns the PGlite extension object.
// We lazy-import so the bundle stays lean — only loaded if the user enables them.

export type ExtensionMeta = {
  id: string;
  name: string;
  description: string;
  category: "text" | "crypto" | "data" | "vector" | "geo" | "util";
  examples?: string[];
  loader: () => Promise<any>;
};

export const EXTENSIONS: ExtensionMeta[] = [
  {
    id: "pg_trgm",
    name: "pg_trgm",
    description: "Trigram-based similarity & fuzzy text matching. Adds operators like %, similarity(), word_similarity().",
    category: "text",
    examples: ["SELECT similarity('postgres', 'postgree')", "SELECT * FROM books WHERE title % 'gatsbi'"],
    loader: async () => (await import("@electric-sql/pglite/contrib/pg_trgm")).pg_trgm,
  },
  {
    id: "fuzzystrmatch",
    name: "fuzzystrmatch",
    description: "Soundex, Metaphone, Levenshtein distance — phonetic + edit-distance string comparisons.",
    category: "text",
    examples: ["SELECT levenshtein('kitten', 'sitting')", "SELECT soundex('Robert')"],
    loader: async () => (await import("@electric-sql/pglite/contrib/fuzzystrmatch")).fuzzystrmatch,
  },
  {
    id: "citext",
    name: "citext",
    description: "Case-insensitive text type. Saves writing LOWER() everywhere.",
    category: "text",
    examples: ["CREATE TABLE t (email citext)", "SELECT * FROM t WHERE email = 'Foo@Bar.com'"],
    loader: async () => (await import("@electric-sql/pglite/contrib/citext")).citext,
  },
  {
    id: "unaccent",
    name: "unaccent",
    description: "Strip diacritics for text normalization. 'café' → 'cafe'.",
    category: "text",
    examples: ["SELECT unaccent('résumé')"],
    loader: async () => (await import("@electric-sql/pglite/contrib/unaccent")).unaccent,
  },
  {
    id: "pgcrypto",
    name: "pgcrypto",
    description: "Cryptographic functions: hashing (md5, sha256), random bytes, encryption.",
    category: "crypto",
    examples: ["SELECT digest('hello', 'sha256')", "SELECT gen_random_uuid()"],
    loader: async () => (await import("@electric-sql/pglite/contrib/pgcrypto")).pgcrypto,
  },
  {
    id: "uuid_ossp",
    name: "uuid-ossp",
    description: "UUID generators (v1, v3, v4, v5). Most apps want gen_random_uuid() from pgcrypto instead.",
    category: "crypto",
    examples: ["SELECT uuid_generate_v4()"],
    loader: async () => (await import("@electric-sql/pglite/contrib/uuid_ossp")).uuid_ossp,
  },
  {
    id: "hstore",
    name: "hstore",
    description: "Simple key→value text store inside a column. Use jsonb for new code; hstore is here for legacy.",
    category: "data",
    examples: ["SELECT 'a=>1, b=>2'::hstore -> 'a'"],
    loader: async () => (await import("@electric-sql/pglite/contrib/hstore")).hstore,
  },
  {
    id: "ltree",
    name: "ltree",
    description: "Hierarchical tree-like data type. Useful for categories, threaded comments, file paths.",
    category: "data",
    examples: ["SELECT 'a.b.c'::ltree <@ 'a.b'"],
    loader: async () => (await import("@electric-sql/pglite/contrib/ltree")).ltree,
  },
  {
    id: "tablefunc",
    name: "tablefunc",
    description: "Pivot tables (crosstab), generate_series for connectby. Essential for reporting queries.",
    category: "util",
    examples: ["SELECT * FROM crosstab(...)"],
    loader: async () => (await import("@electric-sql/pglite/contrib/tablefunc")).tablefunc,
  },
  {
    id: "cube",
    name: "cube",
    description: "Multi-dimensional cubes — interval queries in N-dimensional space. Often paired with earthdistance.",
    category: "geo",
    examples: ["SELECT '(1,2,3)'::cube <-> '(4,5,6)'::cube"],
    loader: async () => (await import("@electric-sql/pglite/contrib/cube")).cube,
  },
  {
    id: "earthdistance",
    name: "earthdistance",
    description: "Great-circle distance calculations on Earth using cube. For full geo, use PostGIS (not yet in PGlite).",
    category: "geo",
    examples: ["SELECT earth_distance(ll_to_earth(40.7, -74.0), ll_to_earth(51.5, -0.13))"],
    loader: async () => (await import("@electric-sql/pglite/contrib/earthdistance")).earthdistance,
  },
];

export function getExtensionsById(ids: string[]): ExtensionMeta[] {
  return EXTENSIONS.filter((e) => ids.includes(e.id));
}
