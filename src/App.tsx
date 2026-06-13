import { createSignal, createEffect, onMount, Show, createMemo } from "solid-js";
import { execSeed, runQuery, getSchema, tableExists, type QueryResult, type QueryError } from "./lib/db";
import { grade, type GradeResult } from "./lib/grader";
import { getPref, setPref, getProgress, setProgress } from "./lib/storage";
import { LEVELS, getLevel, getNextAvailableLevel, resolveExpected, type Challenge } from "./levels";

import Editor from "./components/Editor";
import ResultsTable from "./components/ResultsTable";
import SettingsPanel from "./components/SettingsPanel";
import LessonPane from "./components/LessonPane";
import LevelList from "./components/LevelList";
import Celebration from "./components/Celebration";
import ChallengeStrip from "./components/ChallengeStrip";
import GradeBanner from "./components/GradeBanner";
import RightDrawer from "./components/RightDrawer";
import { IconSchema, IconScripts, IconRun, IconSettings } from "./components/Icons";

export default function App() {
  const [bootStatus, setBootStatus] = createSignal("starting up…");
  const [ready, setReady] = createSignal(false);
  const [showSettings, setShowSettings] = createSignal(false);
  const [celebrate, setCelebrate] = createSignal(false);
  const [drawerOpen, setDrawerOpen] = createSignal(false);
  const [drawerTab, setDrawerTab] = createSignal<"schema" | "scripts">("schema");

  const [currentLevelId, setCurrentLevelId] = createSignal<string>(getPref("currentLevel", "01-books"));
  const [sql, setSql] = createSignal<string>(getPref("lastSql", "SELECT title, author FROM books LIMIT 10;"));
  const [result, setResult] = createSignal<QueryResult | QueryError | null>(null);
  const [running, setRunning] = createSignal(false);
  const [schema, setSchema] = createSignal<{ table: string; columns: { name: string; type: string }[] }[]>([]);
  const [activeChallenge, setActiveChallenge] = createSignal<Challenge | null>(null);
  const [lastGrade, setLastGrade] = createSignal<GradeResult | null>(null);
  const [executedSql, setExecutedSql] = createSignal<string | null>(null);
  const [editorPct, setEditorPct] = createSignal<number>(getPref("editorPct", 42));
  let splitRef: HTMLDivElement | undefined;
  const [progress, setProgressMap] = createSignal<Record<string, "untouched" | "in-progress" | "completed">>({});
  const [solvedIds, setSolvedIds] = createSignal<string[]>([]);

  const currentLevel = createMemo(() => getLevel(currentLevelId()));
  const nextLevel = createMemo(() => getNextAvailableLevel(currentLevelId()));

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
  createEffect(() => setPref("editorPct", editorPct()));

  function startDrag(e: MouseEvent) {
    e.preventDefault();
    if (!splitRef) return;
    const rect = splitRef.getBoundingClientRect();
    const onMove = (m: MouseEvent) => {
      const pct = ((m.clientY - rect.top) / rect.height) * 100;
      setEditorPct(Math.max(15, Math.min(85, pct)));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "row-resize";
  }

  function maximizeResults() {
    setEditorPct(20);
  }
  function resetSplit() {
    setEditorPct(42);
  }

  async function ensureSeeded(levelId: string) {
    const lvl = getLevel(levelId);
    if (!lvl || !lvl.seed) return;
    if (lvl.sentinelTable && (await tableExists(lvl.sentinelTable))) return;
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
    setCelebrate(false);
    await ensureSeeded(id);
    await refreshSchema();
    await loadProgress(id);
  }

  async function executeSql() {
    if (!ready() || running()) return;
    setRunning(true);
    const queryAtRunTime = sql();
    const r = await runQuery(queryAtRunTime);
    setResult(r);
    setExecutedSql(queryAtRunTime);
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
    const wasComplete = lvl.challenges.every((ch) => cur.includes(ch.id));
    const nowComplete = lvl.challenges.every((ch) => next.includes(ch.id));
    const status: "in-progress" | "completed" = nowComplete ? "completed" : "in-progress";
    await setProgress({
      levelId: lvl.id,
      status,
      challengesSolved: next,
      lastAttemptedAt: Date.now(),
    });
    setProgressMap((m) => ({ ...m, [lvl.id]: status }));
    if (!wasComplete && nowComplete) {
      setTimeout(() => setCelebrate(true), 600);
    }
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

  function insertText(text: string) {
    setSql((s) => (s ? s + " " + text : text));
  }

  function loadScript(s: string) {
    setSql(s);
    setDrawerOpen(false);
  }

  const overallProgress = createMemo(() => {
    const built = LEVELS.filter((l) => l.available).length;
    const done = Object.entries(progress()).filter(([id, s]) => s === "completed" && LEVELS.find((l) => l.id === id)?.available).length;
    return { done, total: built };
  });

  return (
    <div class="h-full flex flex-col text-ink">
      {/* Header */}
      <header class="flex items-center justify-between px-4 py-2.5 border-b border-bg-border">
        <div class="flex items-center gap-3.5">
          <div class="font-mono text-sm tracking-tight">
            <span class="text-ink font-medium">sql</span><span class="text-accent">/</span><span class="text-ink-muted">craft</span>
          </div>
          <Show when={ready() && currentLevel()}>
            <div class="flex items-center gap-2 text-xs text-ink-muted font-mono">
              <span class="text-ink-dim">·</span>
              <span class="text-accent">L{currentLevel()!.id.slice(0, 2)}</span>
              <span class="text-ink-muted">{currentLevel()!.title.replace(/^Level \d+ · /, "")}</span>
            </div>
          </Show>
        </div>
        <div class="flex items-center gap-4">
          <Show when={ready()}>
            <div class="flex items-center gap-2.5">
              <div class="w-32 h-[3px] bg-bg-soft overflow-hidden">
                <div
                  class="h-full bg-accent transition-all duration-700"
                  style={{ width: `${(overallProgress().done / Math.max(overallProgress().total, 1)) * 100}%` }}
                />
              </div>
              <span class="label-mono text-ink-muted tabular-nums">{overallProgress().done}/{overallProgress().total}</span>
            </div>
          </Show>
          <Show when={!ready()}>
            <div class="text-xs text-ink-muted flex items-center gap-2 font-mono">
              <div class="w-1.5 h-1.5 rounded-full bg-warn animate-pulse" /> {bootStatus()}
            </div>
          </Show>
          <button
            onClick={() => setShowSettings(true)}
            class="text-ink-muted hover:text-ink p-1.5 hover:bg-bg-panel transition-colors rounded"
            title="Settings"
          >
            <IconSettings />
          </button>
        </div>
      </header>

      <Show when={!ready()}>
        <div class="flex-1 flex items-center justify-center bg-grid">
          <div class="text-center max-w-md px-4 font-mono">
            <div class="flex items-center justify-center gap-1.5 mb-4">
              <div class="w-1.5 h-1.5 bg-accent animate-pulse" />
              <div class="w-1.5 h-1.5 bg-accent animate-pulse" style="animation-delay: 0.15s" />
              <div class="w-1.5 h-1.5 bg-accent animate-pulse" style="animation-delay: 0.3s" />
            </div>
            <div class="text-ink text-base mb-1">booting postgres</div>
            <div class="text-ink-muted text-xs">{bootStatus()}</div>
            <div class="text-ink-dim text-[11px] mt-3">~3 MB · cached after first load</div>
          </div>
        </div>
      </Show>

      <Show when={ready()}>
        <main class="flex-1 flex min-h-0 relative">
          {/* Ultra-slim level rail */}
          <aside class="w-14 border-r border-bg-border bg-bg-soft/30 overflow-y-auto flex-shrink-0">
            <LevelList currentId={currentLevelId()} progress={progress()} onPick={pickLevel} />
          </aside>

          {/* Lesson — wide, generous */}
          <section class="flex-1 min-w-0 max-w-2xl border-r border-bg-border overflow-hidden">
            <Show when={currentLevel()}>
              <LessonPane
                level={currentLevel()!}
                solvedIds={solvedIds()}
                activeChallengeId={activeChallenge()?.id ?? null}
                onPickChallenge={pickChallenge}
                onNextLevel={() => nextLevel() && pickLevel(nextLevel()!.id)}
                hasNextLevel={!!nextLevel()}
              />
            </Show>
          </section>

          {/* Solve — editor, banner, results */}
          <section class="flex-1 flex flex-col min-w-0 relative">
            <Show when={activeChallenge() && currentLevel()}>
              {(_) => {
                const c = activeChallenge()!;
                const lvl = currentLevel()!;
                const idx = lvl.challenges.findIndex((x) => x.id === c.id);
                const nextChallenge = lvl.challenges.find((x, i) => i > idx && !solvedIds().includes(x.id))
                  ?? lvl.challenges[idx + 1];
                return (
                  <ChallengeStrip
                    challenge={c}
                    index={idx}
                    total={lvl.challenges.length}
                    solved={solvedIds().includes(c.id)}
                    hasNext={!!nextChallenge}
                    onClear={() => pickChallenge(null)}
                    onNext={() => nextChallenge && pickChallenge(nextChallenge)}
                  />
                );
              }}
            </Show>

            {/* Tools row */}
            <div class="flex items-center justify-between px-3 py-2 border-b border-bg-border">
              <div class="flex items-center gap-1">
                <button
                  onClick={() => { setDrawerTab("schema"); setDrawerOpen(true); }}
                  class="tooltip flex items-center gap-1.5 px-2 py-1 hover:bg-bg-panel text-ink-muted hover:text-ink transition-colors rounded"
                  data-tip="schema"
                >
                  <IconSchema class="w-4 h-4" />
                  <span class="label-mono">schema</span>
                </button>
                <button
                  onClick={() => { setDrawerTab("scripts"); setDrawerOpen(true); }}
                  class="tooltip flex items-center gap-1.5 px-2 py-1 hover:bg-bg-panel text-ink-muted hover:text-ink transition-colors rounded"
                  data-tip="saved scripts"
                >
                  <IconScripts class="w-4 h-4" />
                  <span class="label-mono">scripts</span>
                </button>
              </div>
              <button
                onClick={executeSql}
                disabled={running()}
                class="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-glow text-bg font-semibold disabled:opacity-50 transition-all rounded"
              >
                <IconRun class="text-bg" />
                <span class="label-mono text-bg">{running() ? "running…" : "run"}</span>
                <span class="label-mono opacity-60 text-bg ml-1">⌘↵</span>
              </button>
            </div>

            <div ref={splitRef} class="flex-1 flex flex-col min-h-0">
              <div class="bg-bg-soft/30 overflow-hidden" style={{ height: `${editorPct()}%` }}>
                <Editor value={sql()} onChange={setSql} onRun={executeSql} schema={schemaForEditor()} />
              </div>

              {/* Drag handle */}
              <div
                onMouseDown={startDrag}
                onDblClick={resetSplit}
                class="group relative h-1.5 bg-bg-border hover:bg-accent/40 cursor-row-resize transition-colors flex-shrink-0"
                title="Drag to resize · double-click to reset"
              >
                <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-bg-border group-hover:bg-accent/60" />
              </div>

              <Show when={lastGrade() && activeChallenge() && currentLevel()}>
                {(_) => {
                  const lvl = currentLevel()!;
                  const c = activeChallenge()!;
                  const idx = lvl.challenges.findIndex((x) => x.id === c.id);
                  const nextChallenge = lvl.challenges.find((x, i) => i > idx && !solvedIds().includes(x.id))
                    ?? lvl.challenges[idx + 1];
                  return (
                    <GradeBanner
                      grade={lastGrade()!}
                      solvedCount={solvedIds().filter((id) => lvl.challenges.find((x) => x.id === id)).length}
                      total={lvl.challenges.length}
                      hasNext={!!nextChallenge && lastGrade()!.pass}
                      onNext={() => nextChallenge && pickChallenge(nextChallenge)}
                    />
                  );
                }}
              </Show>

              {/* Results header with quick expand */}
              <div class="flex items-center justify-between px-3 pt-2 pb-1 flex-shrink-0">
                <div class="label-mono text-ink-dim">results</div>
                <div class="flex items-center gap-0.5">
                  <button
                    onClick={maximizeResults}
                    title="Maximize results"
                    class="px-2 py-0.5 text-ink-muted hover:text-ink hover:bg-bg-panel transition-colors rounded"
                  >
                    <span class="label-mono">expand</span>
                  </button>
                  <button
                    onClick={resetSplit}
                    title="Reset split"
                    class="px-2 py-0.5 text-ink-muted hover:text-ink hover:bg-bg-panel transition-colors rounded"
                  >
                    <span class="label-mono">reset</span>
                  </button>
                </div>
              </div>

              <div class="flex-1 px-3 pb-3 min-h-0">
                <ResultsTable
                  result={result()}
                  loading={running()}
                  executedSql={executedSql()}
                  isStale={!!executedSql() && executedSql() !== sql()}
                />
              </div>
            </div>

            <RightDrawer
              open={drawerOpen()}
              onClose={() => setDrawerOpen(false)}
              tab={drawerTab()}
              setTab={setDrawerTab}
              schema={schema()}
              currentSql={sql()}
              currentLevelId={currentLevelId()}
              onInsertText={insertText}
              onLoadScript={loadScript}
            />
          </section>
        </main>
      </Show>

      <Show when={showSettings()}>
        <SettingsPanel onClose={() => setShowSettings(false)} onExtensionsChanged={refreshSchema} />
      </Show>

      <Show when={celebrate() && currentLevel()}>
        <Celebration
          level={currentLevel()!}
          next={nextLevel()}
          totalChallenges={currentLevel()!.challenges.length}
          onNext={() => {
            setCelebrate(false);
            if (nextLevel()) void pickLevel(nextLevel()!.id);
          }}
          onStay={() => setCelebrate(false)}
        />
      </Show>
    </div>
  );
}
