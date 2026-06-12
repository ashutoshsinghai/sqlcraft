import { createSignal, createEffect, onMount, Show, createMemo } from "solid-js";
import { execSeed, runQuery, getSchema, tableExists, type QueryResult, type QueryError } from "./lib/db";
import { grade, type GradeResult } from "./lib/grader";
import { getPref, setPref, getProgress, setProgress } from "./lib/storage";
import { LEVELS, getLevel } from "./levels";
import { resolveExpected } from "./levels/01-books/challenges";
import type { Challenge } from "./levels/01-books/challenges";

import Editor from "./components/Editor";
import ResultsTable from "./components/ResultsTable";
import SchemaSidebar from "./components/SchemaSidebar";
import ScriptsSidebar from "./components/ScriptsSidebar";
import SettingsPanel from "./components/SettingsPanel";
import LessonPane from "./components/LessonPane";
import LevelList from "./components/LevelList";

export default function App() {
  const [bootStatus, setBootStatus] = createSignal("starting up…");
  const [ready, setReady] = createSignal(false);
  const [showSettings, setShowSettings] = createSignal(false);

  const [currentLevelId, setCurrentLevelId] = createSignal<string>(getPref("currentLevel", "01-books"));
  const [sql, setSql] = createSignal<string>(getPref("lastSql", "SELECT title, author FROM books LIMIT 10;"));
  const [result, setResult] = createSignal<QueryResult | QueryError | null>(null);
  const [running, setRunning] = createSignal(false);
  const [schema, setSchema] = createSignal<{ table: string; columns: { name: string; type: string }[] }[]>([]);
  const [activeChallenge, setActiveChallenge] = createSignal<Challenge | null>(null);
  const [lastGrade, setLastGrade] = createSignal<GradeResult | null>(null);
  const [progress, setProgressMap] = createSignal<Record<string, "untouched" | "in-progress" | "completed">>({});
  const [solvedIds, setSolvedIds] = createSignal<string[]>([]);

  const currentLevel = createMemo(() => getLevel(currentLevelId()));

  onMount(async () => {
    try {
      setBootStatus("loading PGlite (Postgres in WASM)…");
      await ensureSeeded(currentLevelId());
      await refreshSchema();
      await loadProgress(currentLevelId());
      const map: Record<string, "untouched" | "in-progress" | "completed"> = {};
      for (const l of LEVELS) {
        const p = await getProgress(l.id);
        map[l.id] = p?.status ?? "untouched";
      }
      setProgressMap(map);
      setBootStatus("ready");
      setReady(true);
    } catch (e: any) {
      setBootStatus(`startup error: ${e?.message ?? e}`);
    }
  });

  createEffect(() => setPref("lastSql", sql()));
  createEffect(() => setPref("currentLevel", currentLevelId()));

  async function ensureSeeded(levelId: string) {
    const lvl = getLevel(levelId);
    if (!lvl || !lvl.seed) return;
    const has = await tableExists("books");
    if (lvl.id === "01-books" && has) return;
    await execSeed(lvl.seed);
  }

  async function refreshSchema() {
    setSchema(await getSchema());
  }

  async function loadProgress(levelId: string) {
    const p = await getProgress(levelId);
    setSolvedIds(p?.challengesSolved ?? []);
  }

  async function pickLevel(id: string) {
    const lvl = getLevel(id);
    if (!lvl || !lvl.available) return;
    setCurrentLevelId(id);
    setActiveChallenge(null);
    setLastGrade(null);
    await ensureSeeded(id);
    await refreshSchema();
    await loadProgress(id);
  }

  async function executeSql() {
    if (!ready() || running()) return;
    setRunning(true);
    const r = await runQuery(sql());
    setResult(r);
    setRunning(false);

    const c = activeChallenge();
    if (c && r.ok) {
      if ((c.grade as any).expectedRows.length === 0) {
        await resolveExpected(c, runQuery);
      }
      const g = grade(c.grade, r);
      setLastGrade(g);
      if (g.pass) await markSolved(c.id);
    } else {
      setLastGrade(null);
    }
  }

  async function markSolved(challengeId: string) {
    const lvl = currentLevel();
    if (!lvl) return;
    const cur = solvedIds();
    if (cur.includes(challengeId)) return;
    const next = [...cur, challengeId];
    setSolvedIds(next);
    const allSolved = lvl.challenges.every((ch) => next.includes(ch.id));
    const status: "in-progress" | "completed" = allSolved ? "completed" : "in-progress";
    await setProgress({
      levelId: lvl.id,
      status,
      challengesSolved: next,
      lastAttemptedAt: Date.now(),
    });
    setProgressMap((m) => ({ ...m, [lvl.id]: status }));
  }

  const schemaForEditor = createMemo(() => {
    const out: Record<string, string[]> = {};
    for (const t of schema()) out[t.table] = t.columns.map((c) => c.name);
    return out;
  });

  function pickChallenge(c: Challenge | null) {
    setActiveChallenge(c);
    setLastGrade(null);
    if (c?.starter) setSql(c.starter);
  }

  function tryExample(sqlText: string) {
    setSql(sqlText);
    void executeSql();
  }

  function insertText(text: string) {
    setSql((s) => (s ? s + " " + text : text));
  }

  function loadScript(s: string) {
    setSql(s);
  }

  return (
    <div class="h-full flex flex-col bg-bg text-ink">
      <header class="flex items-center justify-between px-4 py-2 border-b border-bg-border bg-bg-panel/60">
        <div class="flex items-center gap-3">
          <div class="font-medium text-accent">sqlcraft</div>
          <div class="text-ink-dim text-xs">{bootStatus()}</div>
        </div>
        <div class="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            class="text-xs px-2 py-1 text-ink-muted hover:text-ink rounded hover:bg-bg-panel"
          >
            ⚙ settings
          </button>
        </div>
      </header>

      <Show when={!ready()}>
        <div class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <div class="text-ink-muted text-sm mb-2">{bootStatus()}</div>
            <div class="text-ink-dim text-xs">First load downloads PGlite (~3 MB), then caches forever.</div>
          </div>
        </div>
      </Show>

      <Show when={ready()}>
        <main class="flex-1 flex min-h-0">
          <aside class="w-60 border-r border-bg-border bg-bg-soft p-3 overflow-y-auto space-y-5">
            <LevelList currentId={currentLevelId()} progress={progress()} onPick={pickLevel} />
            <SchemaSidebar schema={schema()} onInsert={insertText} />
            <ScriptsSidebar currentSql={sql()} currentLevelId={currentLevelId()} onLoad={loadScript} />
          </aside>

          <section class="w-[420px] border-r border-bg-border bg-bg-soft min-w-0">
            <Show when={currentLevel()}>
              <LessonPane
                level={currentLevel()!}
                solvedIds={solvedIds()}
                activeChallenge={activeChallenge()}
                lastGrade={lastGrade()}
                onPickChallenge={pickChallenge}
                onTryExample={tryExample}
              />
            </Show>
          </section>

          <section class="flex-1 flex flex-col min-w-0">
            <div class="flex items-center justify-between px-3 py-2 border-b border-bg-border bg-bg-panel/40">
              <div class="text-xs text-ink-muted">
                editor
                <Show when={activeChallenge()}>
                  <span class="ml-2 text-accent">· grading against challenge {activeChallenge()!.id}</span>
                </Show>
              </div>
              <button
                onClick={executeSql}
                disabled={running()}
                class="text-xs px-3 py-1 bg-accent-soft hover:bg-accent text-ink rounded disabled:opacity-50 transition-colors"
              >
                {running() ? "running…" : "▶ run  (⌘↵)"}
              </button>
            </div>
            <div class="h-[45%] border-b border-bg-border">
              <Editor value={sql()} onChange={setSql} onRun={executeSql} schema={schemaForEditor()} />
            </div>
            <div class="flex-1 p-3 min-h-0">
              <ResultsTable result={result()} loading={running()} />
            </div>
          </section>
        </main>
      </Show>

      <Show when={showSettings()}>
        <SettingsPanel onClose={() => setShowSettings(false)} onExtensionsChanged={refreshSchema} />
      </Show>
    </div>
  );
}
