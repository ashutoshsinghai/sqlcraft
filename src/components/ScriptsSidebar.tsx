import { For, Show, createSignal, onMount } from "solid-js";
import { listScripts, saveScript, deleteScript, type SavedScript } from "../lib/storage";

interface Props {
  currentSql: string;
  currentLevelId: string | null;
  onLoad: (sql: string) => void;
}

export default function ScriptsSidebar(props: Props) {
  const [scripts, setScripts] = createSignal<SavedScript[]>([]);
  const [name, setName] = createSignal("");

  const refresh = async () => setScripts(await listScripts());
  onMount(refresh);

  const save = async () => {
    const n = name().trim() || `Script ${new Date().toLocaleString()}`;
    await saveScript({ name: n, sql: props.currentSql, levelId: props.currentLevelId });
    setName("");
    await refresh();
  };

  const remove = async (id?: number) => {
    if (!id) return;
    if (!confirm("Delete this script?")) return;
    await deleteScript(id);
    await refresh();
  };

  return (
    <div class="text-xs space-y-2">
      <div class="text-ink-muted uppercase tracking-wider px-1">Saved scripts</div>
      <div class="flex gap-1">
        <input
          class="flex-1 bg-bg-soft border border-bg-border rounded px-2 py-1 text-ink placeholder-ink-dim outline-none focus:border-accent"
          placeholder="name"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
        />
        <button
          class="px-2 py-1 bg-accent-soft hover:bg-accent text-ink rounded text-[11px] transition-colors"
          onClick={save}
        >
          save
        </button>
      </div>
      <Show when={scripts().length === 0}>
        <div class="text-ink-dim px-1 py-2 italic">No saved scripts yet</div>
      </Show>
      <For each={scripts()}>
        {(s) => (
          <div class="group bg-bg-soft border border-bg-border rounded px-2 py-1.5 hover:border-accent/40">
            <div class="flex items-center justify-between gap-2">
              <button class="text-left text-ink font-mono truncate flex-1" onClick={() => props.onLoad(s.sql)}>
                {s.name}
              </button>
              <button
                class="text-ink-dim opacity-0 group-hover:opacity-100 hover:text-danger transition-opacity"
                onClick={() => remove(s.id)}
                title="delete"
              >
                ×
              </button>
            </div>
            <div class="text-ink-dim text-[10px] mt-0.5">
              {s.levelId ?? "free-play"} · {new Date(s.updatedAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
