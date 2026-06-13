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

function previewSql(sql: string, max = 140): string {
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
    <div class="h-full w-full bg-bg-soft/30 border border-bg-border rounded flex flex-col min-h-0 overflow-hidden">
      <Show when={props.loading}>
        <div class="p-4 text-ink-muted text-sm flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-accent animate-pulse" /> Running query…
        </div>
      </Show>

      <Show when={!props.loading && !props.result}>
        <div class="flex-1 flex items-center justify-center p-10 text-center text-ink-dim">
          <div>
            <div class="label-mono text-ink-dim mb-2">no query yet</div>
            <div class="text-xs font-mono">
              press <span class="text-ink-muted bg-bg-panel px-1.5 py-0.5 rounded">⌘↵</span> in the editor
            </div>
          </div>
        </div>
      </Show>

      <Show when={props.result && !props.result.ok}>
        {(_) => {
          const err = props.result as QueryError;
          return (
            <div class="flex flex-col h-full min-h-0">
              <div class="flex items-center gap-3 px-3 py-2 border-b border-bg-border bg-bg-soft/40 flex-shrink-0">
                <span class="label-mono bg-danger/15 text-danger px-1.5 py-0.5 rounded">error</span>
                <span class="text-xs text-ink-muted tabular-nums font-mono">{err.durationMs} ms</span>
              </div>
              <Show when={props.executedSql}>
                <div class="px-3 py-1.5 border-b border-bg-border bg-bg-soft/20 flex-shrink-0">
                  <span class="label-mono text-ink-dim mr-2">ran</span>
                  <span class="text-[11px] font-mono text-ink-muted break-all">{previewSql(props.executedSql!)}</span>
                </div>
              </Show>
              <div class="flex-1 overflow-auto p-3 min-h-0">
                <pre class="text-[12px] font-mono text-danger whitespace-pre-wrap">{err.error}</pre>
              </div>
            </div>
          );
        }}
      </Show>

      <Show when={props.result && props.result.ok}>
        {(_) => {
          const r = props.result as QueryResult;
          return (
            <div class="flex flex-col h-full min-h-0">
              {/* Status bar */}
              <div class={`flex items-center gap-3 px-3 py-2 border-b border-bg-border bg-bg-soft/40 flex-shrink-0 ${props.isStale ? "opacity-50" : ""}`}>
                <span class="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
                <span class="text-xs text-ink tabular-nums font-mono font-medium">{r.rowCount} row{r.rowCount === 1 ? "" : "s"}</span>
                <span class="text-ink-dim text-xs">·</span>
                <span class="text-xs text-ink-muted tabular-nums font-mono">{r.durationMs} ms</span>
                <Show when={props.isStale}>
                  <span class="label-mono text-warn ml-auto">⚠ edited — re-run</span>
                </Show>
              </div>

              {/* Executed SQL preview */}
              <Show when={props.executedSql}>
                <div class="px-3 py-1.5 border-b border-bg-border bg-bg-soft/20 flex-shrink-0">
                  <span class="label-mono text-ink-dim mr-2">ran</span>
                  <span class="text-[11px] font-mono text-ink-muted break-all">{previewSql(props.executedSql!)}</span>
                </div>
              </Show>

              <Show
                when={r.rows.length > 0}
                fallback={
                  <div class="flex-1 flex items-center justify-center text-ink-dim text-sm font-mono">
                    query succeeded · no rows returned
                  </div>
                }
              >
                {/* Scrollable table area — both directions */}
                <div class="flex-1 overflow-auto min-h-0">
                  <table class="text-xs font-mono w-max min-w-full">
                    <thead class="bg-bg-soft/80 sticky top-0 z-10">
                      <tr>
                        <For each={cols()}>
                          {(c) => (
                            <th class="label-mono text-left px-3 py-2 text-ink-muted border-b border-bg-border whitespace-nowrap">
                              {c}
                            </th>
                          )}
                        </For>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={r.rows}>
                        {(row) => (
                          <tr class="border-b border-bg-border/40 hover:bg-bg-soft/50">
                            <For each={cols()}>
                              {(c) => {
                                const val = row[c];
                                const isNull = val === null || val === undefined;
                                return (
                                  <td
                                    class={`px-3 py-1.5 whitespace-nowrap ${isNull ? "text-ink-dim italic" : "text-ink"}`}
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
