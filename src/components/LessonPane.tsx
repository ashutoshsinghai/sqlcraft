import { createMemo, For, Show, createSignal } from "solid-js";
import { marked } from "marked";
import type { Level } from "../levels";
import type { Challenge } from "../levels/01-books/challenges";
import type { GradeResult } from "../lib/grader";

interface Props {
  level: Level;
  solvedIds: string[];
  activeChallenge: Challenge | null;
  lastGrade: GradeResult | null;
  onPickChallenge: (c: Challenge | null) => void;
  onTryExample: (sql: string) => void;
}

export default function LessonPane(props: Props) {
  const [showHint, setShowHint] = createSignal(0);

  const lessonHtml = createMemo(() => marked.parse(props.level.lesson || "*Lesson coming soon.*") as string);

  const wireUpCodeBlocks = (el: HTMLDivElement) => {
    el.querySelectorAll("pre code").forEach((codeEl) => {
      const sql = codeEl.textContent || "";
      if (codeEl.parentElement?.querySelector(".try-btn")) return;
      const pre = codeEl.parentElement as HTMLElement;
      pre.style.position = "relative";
      const btn = document.createElement("button");
      btn.textContent = "▶ Try";
      btn.className = "try-btn absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-accent-soft hover:bg-accent text-ink rounded transition-colors";
      btn.onclick = (e) => {
        e.preventDefault();
        props.onTryExample(sql.trim());
      };
      pre.appendChild(btn);
    });
  };

  return (
    <div class="h-full overflow-y-auto">
      <div class="p-5 max-w-2xl">
        <div
          ref={(el) => queueMicrotask(() => el && wireUpCodeBlocks(el))}
          class="prose-lesson"
          innerHTML={lessonHtml()}
        />

        <Show when={props.level.challenges.length > 0}>
          <div class="mt-8">
            <h2 class="text-sm uppercase tracking-wider text-ink-muted mb-3">Challenges</h2>
            <div class="space-y-2">
              <For each={props.level.challenges}>
                {(c, i) => {
                  const solved = props.solvedIds.includes(c.id);
                  const active = () => props.activeChallenge?.id === c.id;
                  return (
                    <button
                      class={`w-full text-left p-3 rounded-md border transition-colors ${
                        active() ? "border-accent bg-accent-soft/30" : "border-bg-border bg-bg-soft hover:border-accent/40"
                      }`}
                      onClick={() => props.onPickChallenge(c)}
                    >
                      <div class="flex items-center gap-2 mb-1">
                        <span class={`text-xs px-1.5 py-0.5 rounded ${solved ? "bg-success/20 text-success" : "bg-bg-panel text-ink-muted"}`}>
                          {solved ? "✓ solved" : `#${i() + 1}`}
                        </span>
                        <span class="text-xs text-ink-dim font-mono">{c.id}</span>
                      </div>
                      <div class="text-sm text-ink" innerHTML={marked.parseInline(c.prompt) as string} />
                    </button>
                  );
                }}
              </For>
            </div>

            <Show when={props.activeChallenge}>
              {(_) => {
                const c = props.activeChallenge!;
                return (
                  <div class="mt-4 p-3 bg-bg-soft border border-bg-border rounded-md">
                    <div class="text-xs text-ink-muted uppercase tracking-wider mb-2">Active challenge: {c.id}</div>
                    <div class="text-sm text-ink mb-3" innerHTML={marked.parseInline(c.prompt) as string} />

                    <Show when={props.lastGrade}>
                      <div
                        class={`p-2 rounded-md text-sm mb-2 ${
                          props.lastGrade!.pass ? "bg-success/20 text-success border border-success/40" : "bg-danger/20 text-danger border border-danger/40"
                        }`}
                      >
                        <div class="font-medium">{props.lastGrade!.message}</div>
                        <Show when={props.lastGrade!.details}>
                          <pre class="text-xs mt-1 whitespace-pre-wrap">{props.lastGrade!.details}</pre>
                        </Show>
                      </div>
                    </Show>

                    <div class="flex items-center gap-2 text-xs">
                      <button
                        class="px-2 py-1 bg-bg-panel hover:bg-bg-border rounded text-ink-muted"
                        onClick={() => setShowHint((h) => Math.min(h + 1, c.hints.length))}
                        disabled={showHint() >= c.hints.length}
                      >
                        Hint ({showHint()}/{c.hints.length})
                      </button>
                    </div>
                    <Show when={showHint() > 0}>
                      <div class="mt-2 space-y-1">
                        <For each={c.hints.slice(0, showHint())}>
                          {(h, i) => (
                            <div class="text-xs text-ink-muted bg-bg-panel rounded px-2 py-1.5">
                              <span class="text-warn font-mono">#{i() + 1}</span> {h}
                            </div>
                          )}
                        </For>
                      </div>
                    </Show>
                  </div>
                );
              }}
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}
