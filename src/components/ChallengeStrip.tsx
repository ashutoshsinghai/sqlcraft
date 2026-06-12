import { For, Show, createSignal, createEffect } from "solid-js";
import { marked } from "marked";
import type { Challenge } from "../levels";

interface Props {
  challenge: Challenge;
  index: number;
  total: number;
  solved: boolean;
  onClear: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export default function ChallengeStrip(props: Props) {
  const [showHint, setShowHint] = createSignal(0);

  // Reset hint counter when challenge switches
  createEffect(() => {
    props.challenge.id;
    setShowHint(0);
  });

  return (
    <div class="border-b border-bg-border bg-bg-panel/40 backdrop-blur-sm">
      <div class="px-4 py-3">
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="flex items-center gap-2">
            <span
              class={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                props.solved ? "bg-success/20 text-success" : "bg-accent/20 text-accent"
              }`}
            >
              {props.solved ? "✓ solved" : `challenge ${props.index + 1} of ${props.total}`}
            </span>
            <span class="text-[11px] text-ink-dim font-mono">{props.challenge.id}</span>
          </div>
          <div class="flex items-center gap-1">
            <Show when={props.hasNext}>
              <button
                onClick={props.onNext}
                class="text-[11px] px-2 py-1 text-ink-muted hover:text-ink rounded hover:bg-bg-panel"
                title="Skip to next challenge"
              >
                skip →
              </button>
            </Show>
            <button
              onClick={props.onClear}
              class="text-[11px] px-2 py-1 text-ink-muted hover:text-ink rounded hover:bg-bg-panel"
              title="Clear challenge — return to free play"
            >
              × clear
            </button>
          </div>
        </div>
        <div class="text-sm text-ink leading-relaxed" innerHTML={marked.parseInline(props.challenge.prompt) as string} />

        <div class="mt-2 flex items-center gap-2">
          <button
            class="text-[11px] px-2 py-0.5 bg-bg-soft hover:bg-bg-border rounded text-ink-muted disabled:opacity-40"
            onClick={() => setShowHint((h) => Math.min(h + 1, props.challenge.hints.length))}
            disabled={showHint() >= props.challenge.hints.length}
          >
            💡 hint ({showHint()}/{props.challenge.hints.length})
          </button>
        </div>
        <Show when={showHint() > 0}>
          <div class="mt-2 space-y-1">
            <For each={props.challenge.hints.slice(0, showHint())}>
              {(h, i) => (
                <div class="text-[11px] text-ink-muted bg-bg-soft rounded px-2 py-1.5">
                  <span class="text-warn font-mono mr-1">#{i() + 1}</span> {h}
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}
