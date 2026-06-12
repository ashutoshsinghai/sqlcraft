// PGlite singleton + lifecycle. Persists to IndexedDB so user data survives reloads.

import { PGlite } from "@electric-sql/pglite";
import { getExtensionsById } from "./extensions";
import { getPref } from "./storage";

let _db: PGlite | null = null;
let _ready: Promise<PGlite> | null = null;
let _enabledExtensions: string[] = [];

export async function getDb(): Promise<PGlite> {
  if (_db) return _db;
  if (_ready) return _ready;

  _ready = (async () => {
    const enabledIds = getPref<string[]>("extensions", []);
    _enabledExtensions = enabledIds;

    const extMetas = getExtensionsById(enabledIds);
    const extensions: Record<string, any> = {};
    for (const e of extMetas) {
      try {
        extensions[e.id] = await e.loader();
      } catch (err) {
        console.warn(`Failed to load extension ${e.id}:`, err);
      }
    }

    const pg = await PGlite.create({
      dataDir: "idb://sqlcraft-pglite",
      extensions,
    });
    _db = pg;
    return pg;
  })();

  return _ready;
}

export function getEnabledExtensionIds(): string[] {
  return _enabledExtensions;
}

// Force re-init after extensions list changes (settings panel).
export async function reinitDb(): Promise<void> {
  if (_db) await _db.close().catch(() => {});
  _db = null;
  _ready = null;
  await getDb();
}

export type QueryResult = {
  ok: true;
  rows: Record<string, unknown>[];
  fields: { name: string; dataTypeID?: number }[];
  rowCount: number;
  durationMs: number;
};

export type QueryError = {
  ok: false;
  error: string;
  durationMs: number;
};

export async function runQuery(sql: string): Promise<QueryResult | QueryError> {
  const pg = await getDb();
  const t0 = performance.now();
  try {
    const res = await pg.query<Record<string, unknown>>(sql);
    return {
      ok: true,
      rows: res.rows,
      fields: (res.fields ?? []).map((f: any) => ({ name: f.name, dataTypeID: f.dataTypeID })),
      rowCount: res.rows.length,
      durationMs: Math.round(performance.now() - t0),
    };
  } catch (e: any) {
    return {
      ok: false,
      error: e?.message ?? String(e),
      durationMs: Math.round(performance.now() - t0),
    };
  }
}

export async function execSeed(sql: string): Promise<void> {
  const pg = await getDb();
  await pg.exec(sql);
}

export async function tableExists(name: string): Promise<boolean> {
  const r = await runQuery(`SELECT 1 FROM information_schema.tables WHERE table_name='${name.replace(/'/g, "''")}' LIMIT 1`);
  return r.ok && r.rowCount > 0;
}

export async function getSchema(): Promise<{ table: string; columns: { name: string; type: string }[] }[]> {
  const r = await runQuery(`
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema='public'
    ORDER BY table_name, ordinal_position
  `);
  if (!r.ok) return [];
  const grouped: Record<string, { name: string; type: string }[]> = {};
  for (const row of r.rows) {
    const t = String(row.table_name);
    grouped[t] ??= [];
    grouped[t].push({ name: String(row.column_name), type: String(row.data_type) });
  }
  return Object.entries(grouped).map(([table, columns]) => ({ table, columns }));
}
