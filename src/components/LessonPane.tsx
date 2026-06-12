import { createMemo, For, Show } from "solid-js";
import { marked } from "marked";
import type { Level, Challenge } from "../levels";
import { IconCheck, IconArrowRight } from "./Icons";

interface Props {
  level: Level;
  solvedIds: string[];
  activeChallengeId: string | null;
  hasNextLevel: boolean;
  onPickChallenge: (c: Challenge | null) => void;
  onTryExample: (sql: string) => void;
  onNextLevel: () => void;
}

export default function LessonPane(props: Props) {
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
      <div class="px-10 py-10 max-w-2xl mx-auto">
        {/* Header */}
        <div class="mb-10 pb-6 border-b border-bg-border">
          <div class="label-mono text-accent mb-2">{props.level.subtitle}</div>
          <div class="flex items-center gap-3">
            <div class="font-mono text-[11px] text-ink-muted px-2 py-0.5 bg-bg-soft border border-bg-border rounded">
              {props.level.dataset}
            </div>
            <Show when={props.level.challenges.length > 0}>
              <div class="text-[11px] text-ink-dim font-mono tabular-nums">
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
          <div class="mt-14">
            <h2 class="label-mono text-ink-muted mb-2">Challenges</h2>
            <p class="text-xs text-ink-dim mb-5 font-mono">Click any to start solving — prompt &amp; feedback appear on the right.</p>
            <div class="space-y-2.5">
              <For each={props.level.challenges}>
                {(c, i) => {
                  const solved = createMemo(() => props.solvedIds.includes(c.id));
                  const active = createMemo(() => props.activeChallengeId === c.id);
                  return (
                    <button
                      class={`w-full text-left px-4 py-3.5 border transition-all relative rounded ${
                        active() && !solved()
                          ? "border-accent/70 bg-accent/5"
                          : solved()
                          ? "border-success/40 bg-success/[0.04]"
                          : "border-bg-border bg-bg-soft/40 hover:border-ink-dim hover:bg-bg-soft"
                      }`}
                      onClick={() => props.onPickChallenge(c)}
                    >
                      <Show when={solved()}>
                        <div class="absolute top-3 right-3 w-5 h-5 bg-success/20 border border-success/40 flex items-center justify-center text-success rounded">
                          <IconCheck class="w-3 h-3" />
                        </div>
                      </Show>
                      <div class="flex items-center gap-2 mb-1.5">
                        <span
                          class={`label-mono px-1.5 py-0.5 rounded ${
                            solved()
                              ? "bg-success/15 text-success"
                              : active()
                              ? "bg-accent/20 text-accent"
                              : "bg-bg-panel text-ink-muted"
                          }`}
                        >
                          {solved() ? "solved" : `${String(i() + 1).padStart(2, "0")}`}
                        </span>
                        <Show when={active() && !solved()}>
                          <span class="label-mono text-accent flex items-center gap-0.5">
                            active <IconArrowRight class="w-3 h-3" />
                          </span>
                        </Show>
                      </div>
                      <div
                        class={`text-[13.5px] leading-relaxed ${solved() ? "text-ink-muted line-through decoration-success/40" : "text-ink"}`}
                        innerHTML={marked.parseInline(c.prompt) as string}
                      />
                    </button>
                  );
                }}
              </For>
            </div>

            <Show when={allSolved()}>
              <div class="mt-8 px-5 py-5 border border-success/30 bg-success/[0.05] rounded">
                <div class="label-mono text-success mb-1">level complete</div>
                <div class="text-sm text-ink-muted mb-4 font-mono">
                  All {props.level.challenges.length} challenges solved.
                </div>
                <Show
                  when={props.hasNextLevel}
                  fallback={
                    <div class="text-xs text-ink-dim font-mono">End of built content — more levels coming.</div>
                  }
                >
                  <button
                    onClick={props.onNextLevel}
                    class="flex items-center gap-2 px-3.5 py-2 bg-accent hover:bg-accent-glow text-bg font-semibold rounded transition-colors"
                  >
                    <span class="label-mono">next level</span>
                    <IconArrowRight class="w-3.5 h-3.5 text-bg" />
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
