import { Show, For, createSignal, onMount } from "solid-js";
import { listScripts, saveScript, deleteScript, type SavedScript } from "../lib/storage";

interface Props {
  open: boolean;
  onClose: () => void;
  tab: "schema" | "scripts";
  setTab: (t: "schema" | "scripts") => void;
  schema: { table: string; columns: { name: string; type: string }[] }[];
  currentSql: string;
  currentLevelId: string | null;
  onInsertText: (s: string) => void;
  onLoadScript: (s: string) => void;
}

export default function RightDrawer(props: Props) {
  const [scripts, setScripts] = createSignal<SavedScript[]>([]);
  const [scriptName, setScriptName] = createSignal("");

  const refreshScripts = async () => setScripts(await listScripts());
  onMount(refreshScripts);

  const handleSave = async () => {
    const n = scriptName().trim() || `Script ${new Date().toLocaleTimeString()}`;
    await saveScript({ name: n, sql: props.currentSql, levelId: props.currentLevelId });
    setScriptName("");
    await refreshScripts();
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete this script?")) return;
    await deleteScript(id);
    await refreshScripts();
  };

  return (
    <Show when={props.open}>
      <div class="absolute inset-0 z-30 flex" onClick={props.onClose}>
        <div class="flex-1" />
        <div
          class="w-80 bg-bg-soft border-l border-bg-border h-full overflow-hidden flex flex-col animate-slide-down"
          onClick={(e) => e.stopPropagation()}
        >
          <div class="flex items-center justify-between px-4 py-3 border-b border-bg-border">
            <div class="flex gap-1">
              <button
                onClick={() => props.setTab("schema")}
                class={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  props.tab === "schema" ? "bg-bg-panel text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                Schema
              </button>
              <button
                onClick={() => props.setTab("scripts")}
                class={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  props.tab === "scripts" ? "bg-bg-panel text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                Scripts
              </button>
            </div>
            <button class="text-ink-muted hover:text-ink text-lg leading-none" onClick={props.onClose}>
              ×
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <Show when={props.tab === "schema"}>
              <Show when={props.schema.length === 0}>
                <div class="text-ink-dim text-sm italic">No tables loaded yet</div>
              </Show>
              <div class="space-y-3">
                <For each={props.schema}>
                  {(t) => (
                    <div>
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="font-mono text-accent text-sm">{t.table}</span>
                        <span class="text-ink-dim text-xs">{t.columns.length} cols</span>
                      </div>
                      <div class="space-y-0.5 ml-2 pl-3 border-l border-bg-border">
                        <For each={t.columns}>
                          {(c) => (
                            <button
                              class="flex items-center justify-between w-full text-left py-1 px-2 rounded hover:bg-bg-panel font-mono text-xs group"
                              onClick={() => props.onInsertText(c.name)}
                              title="Insert column name"
                            >
                              <span class="text-ink">{c.name}</span>
                              <span class="text-ink-dim group-hover:text-ink-muted">{c.type}</span>
                            </button>
                          )}
                        </For>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>

            <Show when={props.tab === "scripts"}>
              <div class="flex gap-2 mb-4">
                <input
                  class="flex-1 bg-bg text-sm border border-bg-border rounded-md px-2.5 py-1.5 text-ink placeholder-ink-dim outline-none focus:border-accent"
                  placeholder="name this script…"
                  value={scriptName()}
                  onInput={(e) => setScriptName(e.currentTarget.value)}
                />
                <button
                  class="px-3 py-1.5 text-xs bg-accent hover:bg-accent-glow text-bg font-medium rounded-md"
                  onClick={handleSave}
                >
                  save
                </button>
              </div>
              <Show when={scripts().length === 0}>
                <div class="text-ink-dim text-sm italic">No saved scripts yet. Save a query to come back to it later.</div>
              </Show>
              <div class="space-y-1.5">
                <For each={scripts()}>
                  {(s) => (
                    <div class="group bg-bg border border-bg-border rounded-md p-2.5 hover:border-accent/40 transition-colors">
                      <div class="flex items-center justify-between gap-2 mb-1">
                        <button
                          class="text-left text-sm text-ink font-medium truncate flex-1 hover:text-accent"
                          onClick={() => props.onLoadScript(s.sql)}
                        >
                          {s.name}
                        </button>
                        <button
                          class="text-ink-dim opacity-0 group-hover:opacity-100 hover:text-danger transition-opacity text-base leading-none"
                          onClick={() => handleDelete(s.id)}
                          title="delete"
                        >
                          ×
                        </button>
                      </div>
                      <div class="text-ink-dim text-[10px]">
                        {s.levelId ?? "free-play"} · {new Date(s.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
}
