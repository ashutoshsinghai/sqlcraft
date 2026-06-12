// IndexedDB persistence via Dexie + localStorage for small flags.
// Saved scripts, progress, settings — everything users care about across sessions.

import Dexie, { type Table } from "dexie";

export interface SavedScript {
  id?: number;
  name: string;
  sql: string;
  levelId: string | null; // null = unattached / free-play
  createdAt: number;
  updatedAt: number;
}

export interface ProgressRecord {
  levelId: string;
  status: "untouched" | "in-progress" | "completed";
  challengesSolved: string[];
  lastAttemptedAt: number;
}

class SqlCraftDB extends Dexie {
  scripts!: Table<SavedScript, number>;
  progress!: Table<ProgressRecord, string>;

  constructor() {
    super("sqlcraft");
    this.version(1).stores({
      scripts: "++id, name, levelId, updatedAt",
      progress: "levelId",
    });
  }
}

export const db = new SqlCraftDB();

// localStorage helpers — tiny prefs that don't justify IndexedDB roundtrips
const LS_PREFIX = "sqlcraft:";

export function getPref<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function setPref<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
  } catch {
    /* quota or private-mode — silently ignore */
  }
}

export async function saveScript(s: Omit<SavedScript, "id" | "createdAt" | "updatedAt"> & { id?: number }) {
  const now = Date.now();
  if (s.id) {
    await db.scripts.update(s.id, { ...s, updatedAt: now });
    return s.id;
  }
  return db.scripts.add({ ...s, createdAt: now, updatedAt: now });
}

export async function listScripts(): Promise<SavedScript[]> {
  return db.scripts.orderBy("updatedAt").reverse().toArray();
}

export async function deleteScript(id: number) {
  return db.scripts.delete(id);
}

export async function getProgress(levelId: string): Promise<ProgressRecord | undefined> {
  return db.progress.get(levelId);
}

export async function setProgress(p: ProgressRecord) {
  return db.progress.put(p);
}

export async function exportAll(): Promise<string> {
  const [scripts, progress] = await Promise.all([db.scripts.toArray(), db.progress.toArray()]);
  return JSON.stringify(
    {
      _format: "sqlcraft/v1",
      exportedAt: new Date().toISOString(),
      scripts,
      progress,
      prefs: Object.fromEntries(
        Object.keys(localStorage)
          .filter((k) => k.startsWith(LS_PREFIX))
          .map((k) => [k.slice(LS_PREFIX.length), JSON.parse(localStorage.getItem(k) || "null")]),
      ),
    },
    null,
    2,
  );
}
