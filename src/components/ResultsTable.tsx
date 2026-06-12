import { For, Show, createMemo } from "solid-js";
import type { QueryResult, QueryError } from "../lib/db";

interface Props {
  result: QueryResult | QueryError | null;
  loading?: boolean;
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export default function ResultsTable(props: Props) {
  const cols = createMemo(() => {
    if (!props.result || !props.result.ok) return [];
    if (props.result.rows.length === 0) return props.result.fields.map((f) => f.name);
    return Object.keys(props.result.rows[0]);
  });

  return (
    <div class="h-full overflow-auto bg-bg-soft border border-bg-border rounded-md">
      <Show when={props.loading}>
        <div class="p-4 text-ink-muted text-sm flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-accent animate-pulse" /> Running query…
        </div>
      </Show>

      <Show when={!props.loading && !props.result}>
        <div class="p-6 text-center text-ink-dim text-sm">
          <div class="mb-2">No query yet</div>
          <div class="text-xs">
            Write SQL in the editor and press <span class="font-mono text-ink-muted">⌘+Enter</span> to run.
          </div>
        </div>
      </Show>

      <Show when={props.result && !props.result.ok}>
        {(_) => {
          const err = props.result as QueryError;
          return (
            <div class="p-4 font-mono text-sm">
              <div class="text-danger mb-2 flex items-center gap-2">
                <span class="text-xs px-1.5 py-0.5 rounded bg-danger/20">error</span>
                <span class="text-xs text-ink-dim">{err.durationMs}ms</span>
              </div>
              <pre class="text-ink whitespace-pre-wrap">{err.error}</pre>
            </div>
          );
        }}
      </Show>

      <Show when={props.result && props.result.ok}>
        {(_) => {
          const r = props.result as QueryResult;
          return (
            <div>
              <div class="flex items-center gap-3 px-3 py-2 border-b border-bg-border text-xs text-ink-muted bg-bg-panel">
                <span class="text-success">●</span>
                <span>{r.rowCount} row{r.rowCount === 1 ? "" : "s"}</span>
                <span>·</span>
                <span>{r.durationMs}ms</span>
              </div>
              <Show
                when={r.rows.length > 0}
                fallback={<div class="p-4 text-ink-dim text-sm">Query succeeded; no rows returned.</div>}
              >
                <table class="w-full text-xs font-mono">
                  <thead class="bg-bg-panel sticky top-0">
                    <tr>
                      <For each={cols()}>
                        {(c) => (
                          <th class="text-left px-3 py-1.5 text-ink-muted font-normal border-b border-bg-border whitespace-nowrap">
                            {c}
                          </th>
                        )}
                      </For>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={r.rows}>
                      {(row) => (
                        <tr class="border-b border-bg-border/60 hover:bg-bg-panel/40">
                          <For each={cols()}>
                            {(c) => {
                              const val = row[c];
                              const isNull = val === null || val === undefined;
                              return (
                                <td
                                  class={`px-3 py-1 whitespace-nowrap ${isNull ? "text-ink-dim italic" : "text-ink"}`}
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
              </Show>
            </div>
          );
        }}
      </Show>
    </div>
  );
}
