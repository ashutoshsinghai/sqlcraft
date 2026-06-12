import { For, Show, createSignal } from "solid-js";

interface Props {
  schema: { table: string; columns: { name: string; type: string }[] }[];
  onInsert: (text: string) => void;
}

export default function SchemaSidebar(props: Props) {
  const [expanded, setExpanded] = createSignal<Record<string, boolean>>({});

  return (
    <div class="text-xs">
      <div class="text-ink-muted uppercase tracking-wider mb-2 px-1">Tables</div>
      <Show when={props.schema.length === 0}>
        <div class="text-ink-dim px-1 py-2 italic">No tables loaded</div>
      </Show>
      <For each={props.schema}>
        {(t) => (
          <div class="mb-1">
            <button
              class="flex items-center gap-1.5 w-full text-left px-1 py-1 rounded hover:bg-bg-panel"
              onClick={() => setExpanded((e) => ({ ...e, [t.table]: !e[t.table] }))}
            >
              <span class="text-ink-dim text-[10px]">{expanded()[t.table] ? "▾" : "▸"}</span>
              <span class="font-mono text-accent">{t.table}</span>
              <span class="text-ink-dim ml-auto">{t.columns.length}</span>
            </button>
            <Show when={expanded()[t.table] ?? true}>
              <div class="ml-3 mt-0.5 border-l border-bg-border pl-2">
                <For each={t.columns}>
                  {(c) => (
                    <button
                      class="flex items-center justify-between w-full text-left px-1 py-0.5 rounded hover:bg-bg-panel font-mono"
                      title={`Click to insert "${c.name}"`}
                      onClick={() => props.onInsert(c.name)}
                    >
                      <span class="text-ink">{c.name}</span>
                      <span class="text-ink-dim text-[10px] ml-2">{c.type}</span>
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
}
