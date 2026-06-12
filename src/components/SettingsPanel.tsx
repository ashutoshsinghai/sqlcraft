import { For, Show, createSignal } from "solid-js";
import { EXTENSIONS } from "../lib/extensions";
import { getPref, setPref, exportAll } from "../lib/storage";
import { reinitDb } from "../lib/db";

interface Props {
  onClose: () => void;
  onExtensionsChanged: () => void;
}

export default function SettingsPanel(props: Props) {
  const [enabled, setEnabled] = createSignal<string[]>(getPref<string[]>("extensions", []));
  const [busy, setBusy] = createSignal(false);
  const [dirty, setDirty] = createSignal(false);

  const toggle = (id: string) => {
    setEnabled((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      return next;
    });
    setDirty(true);
  };

  const apply = async () => {
    setBusy(true);
    setPref("extensions", enabled());
    await reinitDb();
    props.onExtensionsChanged();
    setBusy(false);
    setDirty(false);
  };

  const exportData = async () => {
    const json = await exportAll();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sqlcraft-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const grouped = () => {
    const g: Record<string, typeof EXTENSIONS> = {};
    for (const e of EXTENSIONS) {
      g[e.category] ??= [] as any;
      g[e.category].push(e);
    }
    return g;
  };

  const CATEGORY_LABELS: Record<string, string> = {
    text: "Text & search",
    crypto: "Cryptography",
    data: "Data types",
    vector: "Vector / embeddings",
    geo: "Geometry & geo",
    util: "Utilities",
  };

  return (
    <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={props.onClose}>
      <div class="bg-bg-soft border border-bg-border rounded-lg max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div class="flex items-center justify-between px-5 py-4 border-b border-bg-border">
          <h2 class="text-ink text-lg font-medium">Settings</h2>
          <button onClick={props.onClose} class="text-ink-muted hover:text-ink text-xl leading-none">×</button>
        </div>

        <div class="overflow-y-auto p-5 space-y-6 flex-1">
          <section>
            <h3 class="text-sm text-ink uppercase tracking-wider mb-1">Postgres extensions</h3>
            <p class="text-xs text-ink-muted mb-4">
              Enable Postgres extensions for advanced query types. Each gets <code class="px-1.5 py-0.5 bg-bg-panel rounded text-warn">CREATE EXTENSION</code>'d automatically when the database starts. Toggling here re-initializes the database, so your saved data persists but in-memory query state resets.
            </p>

            <For each={Object.entries(grouped())}>
              {([cat, exts]) => (
                <div class="mb-4">
                  <div class="text-xs text-ink-dim uppercase tracking-wider mb-2">{CATEGORY_LABELS[cat] ?? cat}</div>
                  <div class="space-y-2">
                    <For each={exts}>
                      {(ext) => {
                        const isOn = () => enabled().includes(ext.id);
                        return (
                          <label class="flex items-start gap-3 p-3 rounded-md bg-bg-panel border border-bg-border hover:border-accent/40 cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              class="mt-0.5 accent-accent"
                              checked={isOn()}
                              onChange={() => toggle(ext.id)}
                            />
                            <div class="flex-1 min-w-0">
                              <div class="flex items-baseline gap-2">
                                <span class="font-mono text-accent text-sm">{ext.name}</span>
                              </div>
                              <div class="text-xs text-ink-muted mt-1">{ext.description}</div>
                              <Show when={ext.examples?.length}>
                                <div class="mt-2 space-y-1">
                                  <For each={ext.examples!}>
                                    {(eg) => (
                                      <code class="block text-[11px] font-mono text-warn bg-bg-soft border border-bg-border rounded px-2 py-1">
                                        {eg}
                                      </code>
                                    )}
                                  </For>
                                </div>
                              </Show>
                            </div>
                          </label>
                        );
                      }}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </section>

          <section>
            <h3 class="text-sm text-ink uppercase tracking-wider mb-2">Data</h3>
            <p class="text-xs text-ink-muted mb-3">
              Everything you do is saved in your browser (IndexedDB + localStorage). Export it anytime; nothing leaves your machine.
            </p>
            <button onClick={exportData} class="text-xs px-3 py-1.5 bg-bg-panel border border-bg-border hover:border-accent rounded text-ink">
              Export all data as JSON
            </button>
          </section>
        </div>

        <div class="px-5 py-3 border-t border-bg-border flex items-center justify-between bg-bg-panel">
          <div class="text-xs text-ink-dim">
            <Show when={dirty()}>You have unsaved extension changes.</Show>
          </div>
          <div class="flex gap-2">
            <button onClick={props.onClose} class="px-3 py-1.5 text-xs text-ink-muted hover:text-ink">
              Cancel
            </button>
            <button
              onClick={apply}
              disabled={busy() || !dirty()}
              class="px-3 py-1.5 text-xs bg-accent-soft hover:bg-accent text-ink rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {busy() ? "Applying…" : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
