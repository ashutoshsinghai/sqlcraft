import { For, Show, createMemo } from "solid-js";
import type { QueryResult, QueryError } from "../lib/db";

interface Props {
  result: QueryResult | QueryError | null;
  loading?: boolean;
  executedSql?: string | null;
  isStale?: boolean;
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function previewSql(sql: string, max = 120): string {
  const flat = sql.replace(/\s+/g, " ").trim();
  return flat.length > max ? flat.slice(0, max - 1) + "…" : flat;
}

export default function ResultsTable(props: Props) {
  const cols = createMemo(() => {
    if (!props.result || !props.result.ok) return [];
    if (props.result.rows.length === 0) return props.result.fields.map((f) => f.name);
    return Object.keys(props.result.rows[0]);
  });

  return (
    <div class="h-full overflow-hidden bg-bg-soft/40 border border-bg-border rounded-xl flex flex-col">
      <Show when={props.loading}>
        <div class="p-5 text-ink-muted text-sm flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-accent animate-pulse" /> Running query…
        </div>
      </Show>

      <Show when={!props.loading && !props.result}>
        <div class="p-10 text-center text-ink-dim text-sm flex-1 flex flex-col items-center justify-center">
          <div class="text-2xl mb-3 opacity-50">⌨</div>
          <div class="mb-1 text-ink-muted">Run a query to see results.</div>
          <div class="text-xs">
            Press <span class="font-mono text-ink-muted bg-bg-panel px-1.5 py-0.5 rounded">⌘ + Enter</span> in the editor.
          </div>
        </div>
      </Show>

      <Show when={props.result && !props.result.ok}>
        {(_) => {
          const err = props.result as QueryError;
          return (
            <div class="flex flex-col h-full">
              <Show when={props.executedSql}>
                <div class="px-4 py-2 border-b border-bg-border bg-bg-soft/40">
                  <div class="text-[10px] uppercase tracking-wider text-ink-dim mb-1">ran</div>
                  <div class="text-[11px] font-mono text-ink-muted break-all">{previewSql(props.executedSql!)}</div>
                </div>
              </Show>
              <div class="p-4 font-mono text-sm overflow-auto">
                <div class="text-danger mb-2 flex items-center gap-2">
                  <span class="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-danger/20 font-sans font-medium">error</span>
                  <span class="text-xs text-ink-dim">{err.durationMs}ms</span>
                </div>
                <pre class="text-ink whitespace-pre-wrap">{err.error}</pre>
              </div>
            </div>
          );
        }}
      </Show>

      <Show when={props.result && props.result.ok}>
        {(_) => {
          const r = props.result as QueryResult;
          return (
            <div class="flex flex-col h-full overflow-hidden">
              <div class={`flex items-center gap-3 px-4 py-2.5 border-b border-bg-border ${props.isStale ? "opacity-50" : ""}`}>
                <span class="w-1.5 h-1.5 rounded-full bg-success" />
                <span class="text-xs text-ink tabular-nums font-medium">{r.rowCount} row{r.rowCount === 1 ? "" : "s"}</span>
                <span class="text-ink-dim text-xs">·</span>
                <span class="text-xs text-ink-muted tabular-nums">{r.durationMs} ms</span>
                <Show when={props.isStale}>
                  <span class="text-xs text-warn ml-2">⚠ editor edited — re-run to refresh</span>
                </Show>
              </div>
              <Show when={props.executedSql}>
                <div class="px-4 py-2 border-b border-bg-border bg-bg-soft/30">
                  <div class="text-[10px] uppercase tracking-wider text-ink-dim mb-0.5">ran</div>
                  <div class="text-[11px] font-mono text-ink-muted break-all">{previewSql(props.executedSql!)}</div>
                </div>
              </Show>
              <Show
                when={r.rows.length > 0}
                fallback={<div class="p-4 text-ink-dim text-sm">Query succeeded; no rows returned.</div>}
              >
                <div class="flex-1 overflow-auto">
                  <table class="w-full text-xs font-mono">
                    <thead class="bg-bg-soft/60 sticky top-0">
                      <tr>
                        <For each={cols()}>
                          {(c) => (
                            <th class="text-left px-4 py-2 text-ink-muted font-medium border-b border-bg-border whitespace-nowrap text-[10px] uppercase tracking-wider">
                              {c}
                            </th>
                          )}
                        </For>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={r.rows}>
                        {(row) => (
                          <tr class="border-b border-bg-border/40 hover:bg-bg-soft/40">
                            <For each={cols()}>
                              {(c) => {
                                const val = row[c];
                                const isNull = val === null || val === undefined;
                                return (
                                  <td
                                    class={`px-4 py-1.5 whitespace-nowrap ${isNull ? "text-ink-dim italic" : "text-ink"}`}
                                  >
                                    {formatCell(val)}
                                  </td>
                                );
                              }}
                            </For>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </Show>
            </div>
          );
        }}
      </Show>
    </div>
  );
}
