import { createMemo, For, Show, createSignal } from "solid-js";
import { marked } from "marked";
import type { Level, Challenge } from "../levels";
import type { GradeResult } from "../lib/grader";

interface Props {
  level: Level;
  solvedIds: string[];
  activeChallenge: Challenge | null;
  lastGrade: GradeResult | null;
  hasNextLevel: boolean;
  onPickChallenge: (c: Challenge | null) => void;
  onTryExample: (sql: string) => void;
  onNextLevel: () => void;
}

export default function LessonPane(props: Props) {
  const [showHint, setShowHint] = createSignal(0);

  const lessonHtml = createMemo(() => marked.parse(props.level.lesson || "*Lesson coming soon — pick a built level on the left.*") as string);

  const allSolved = createMemo(() => props.level.challenges.length > 0 && props.level.challenges.every((c) => props.solvedIds.includes(c.id)));

  const wireUpCodeBlocks = (el: HTMLDivElement) => {
    el.querySelectorAll("pre code").forEach((codeEl) => {
      const sql = codeEl.textContent || "";
      if (codeEl.parentElement?.querySelector(".try-btn")) return;
      const pre = codeEl.parentElement as HTMLElement;
      pre.style.position = "relative";
      const btn = document.createElement("button");
      btn.textContent = "▶ Try";
      btn.className = "try-btn absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-accent-soft hover:bg-accent text-bg font-medium rounded transition-colors";
      btn.onclick = (e) => {
        e.preventDefault();
        props.onTryExample(sql.trim());
      };
      pre.appendChild(btn);
    });
  };

  return (
    <div class="h-full overflow-y-auto">
      <div class="p-6 max-w-2xl mx-auto">
        {/* Header card with level metadata */}
        <div class="mb-6 pb-5 border-b border-bg-border">
          <div class="text-[11px] uppercase tracking-widest text-accent mb-1.5">{props.level.subtitle}</div>
          <div class="flex items-center gap-3 mb-1">
            <div class="text-xs text-ink-dim font-mono px-2 py-0.5 bg-bg-panel rounded">{props.level.dataset}</div>
            <Show when={props.level.challenges.length > 0}>
              <div class="text-xs text-ink-dim">
                {props.solvedIds.filter((id) => props.level.challenges.find((c) => c.id === id)).length}/{props.level.challenges.length} challenges
              </div>
            </Show>
          </div>
        </div>

        <div
          ref={(el) => queueMicrotask(() => el && wireUpCodeBlocks(el))}
          class="prose-lesson"
          innerHTML={lessonHtml()}
        />

        <Show when={props.level.challenges.length > 0}>
          <div class="mt-10">
            <h2 class="text-xs uppercase tracking-widest text-ink-muted mb-3 font-semibold">Challenges</h2>
            <div class="space-y-2.5">
              <For each={props.level.challenges}>
                {(c, i) => {
                  const solved = props.solvedIds.includes(c.id);
                  const active = () => props.activeChallenge?.id === c.id;
                  return (
                    <button
                      class={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        active()
                          ? "border-accent bg-accent/10 shadow-lg shadow-accent/10"
                          : solved
                          ? "border-success/30 bg-success/5 hover:border-success/50"
                          : "border-bg-border bg-bg-soft hover:border-accent/40 hover:bg-bg-panel"
                      }`}
                      onClick={() => props.onPickChallenge(c)}
                    >
                      <div class="flex items-center gap-2 mb-1.5">
                        <span
                          class={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            solved ? "bg-success/20 text-success" : "bg-bg-panel text-ink-muted"
                          }`}
                        >
                          {solved ? "✓ solved" : `#${i() + 1}`}
                        </span>
                      </div>
                      <div class="text-sm text-ink leading-relaxed" innerHTML={marked.parseInline(c.prompt) as string} />
                    </button>
                  );
                }}
              </For>
            </div>

            <Show when={props.activeChallenge}>
              {(_) => {
                const c = props.activeChallenge!;
                return (
                  <div class="mt-5 p-4 bg-bg-panel/60 border border-accent/30 rounded-xl">
                    <div class="text-[10px] uppercase tracking-widest text-accent mb-2 font-semibold">
                      Now solving · {c.id}
                    </div>
                    <div class="text-sm text-ink mb-3" innerHTML={marked.parseInline(c.prompt) as string} />

                    <Show when={props.lastGrade}>
                      <div
                        class={`p-3 rounded-lg text-sm mb-3 ${
                          props.lastGrade!.pass
                            ? "bg-success/15 text-success border border-success/30"
                            : "bg-danger/15 text-danger border border-danger/30"
                        }`}
                      >
                        <div class="font-medium flex items-center gap-2">
                          {props.lastGrade!.pass ? "✓" : "✗"} {props.lastGrade!.message}
                        </div>
                        <Show when={props.lastGrade!.details}>
                          <pre class="text-xs mt-1.5 whitespace-pre-wrap opacity-80">{props.lastGrade!.details}</pre>
                        </Show>
                      </div>
                    </Show>

                    <div class="flex items-center gap-2 text-xs">
                      <button
                        class="px-2.5 py-1 bg-bg-soft hover:bg-bg-border rounded-md text-ink-muted disabled:opacity-40"
                        onClick={() => setShowHint((h) => Math.min(h + 1, c.hints.length))}
                        disabled={showHint() >= c.hints.length}
                      >
                        💡 Hint ({showHint()}/{c.hints.length})
                      </button>
                    </div>
                    <Show when={showHint() > 0}>
                      <div class="mt-2.5 space-y-1.5">
                        <For each={c.hints.slice(0, showHint())}>
                          {(h, i) => (
                            <div class="text-xs text-ink-muted bg-bg-soft rounded-lg px-3 py-2">
                              <span class="text-warn font-mono mr-1">#{i() + 1}</span> {h}
                            </div>
                          )}
                        </For>
                      </div>
                    </Show>
                  </div>
                );
              }}
            </Show>

            {/* Bottom CTA — visible whenever all challenges solved */}
            <Show when={allSolved()}>
              <div class="mt-8 p-5 bg-gradient-to-br from-accent/15 to-success/10 border border-accent/40 rounded-xl text-center">
                <div class="text-2xl mb-2">✨</div>
                <div class="text-ink font-medium mb-1">All challenges solved.</div>
                <div class="text-ink-muted text-sm mb-4">Nice work on {props.level.title.split("·")[0].trim()}.</div>
                <Show
                  when={props.hasNextLevel}
                  fallback={
                    <div class="text-ink-dim text-xs">You're at the end of what's been built. More levels coming!</div>
                  }
                >
                  <button
                    onClick={props.onNextLevel}
                    class="px-5 py-2.5 bg-accent hover:bg-accent-glow text-bg font-medium rounded-lg shadow-lg shadow-accent/30 text-sm"
                  >
                    Continue to next level →
                  </button>
                </Show>
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}
