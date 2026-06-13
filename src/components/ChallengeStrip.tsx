import { For, Show, createSignal, createEffect, on } from "solid-js";
import { marked } from "marked";
import type { Challenge } from "../levels";
import { IconHint, IconArrowRight, IconClose } from "./Icons";

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

  // Reset hint counter when challenge switches — `on()` reliably tracks the prop accessor
  createEffect(on(() => props.challenge.id, () => setShowHint(0), { defer: true }));

  return (
    <div class="border-b border-bg-border bg-bg-soft/30">
      <div class="px-4 py-3">
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="flex items-center gap-2">
            <span
              class={`label-mono px-1.5 py-0.5 rounded ${
                props.solved ? "bg-success/15 text-success" : "bg-accent/15 text-accent"
              }`}
            >
              {props.solved ? "solved" : `${String(props.index + 1).padStart(2, "0")}/${String(props.total).padStart(2, "0")}`}
            </span>
            <span class="label-mono text-ink-dim">{props.challenge.id}</span>
          </div>
          <div class="flex items-center gap-0.5">
            <Show when={props.hasNext}>
              <button
                onClick={props.onNext}
                class="flex items-center gap-1 px-2 py-1 text-ink-muted hover:text-ink hover:bg-bg-panel rounded transition-colors"
                title="Skip to next challenge"
              >
                <span class="label-mono">skip</span>
                <IconArrowRight class="w-3 h-3" />
              </button>
            </Show>
            <button
              onClick={props.onClear}
              class="flex items-center gap-1 px-2 py-1 text-ink-muted hover:text-ink hover:bg-bg-panel rounded transition-colors"
              title="Clear challenge"
            >
              <IconClose class="w-3 h-3" />
              <span class="label-mono">clear</span>
            </button>
          </div>
        </div>
        <div class="text-[13.5px] text-ink leading-relaxed mb-2.5" innerHTML={marked.parseInline(props.challenge.prompt) as string} />

        <div class="flex items-center gap-2">
          <button
            class="flex items-center gap-1.5 px-2 py-0.5 bg-bg-soft hover:bg-bg-panel border border-bg-border rounded text-ink-muted hover:text-ink disabled:opacity-40 transition-colors"
            onClick={() => setShowHint((h) => Math.min(h + 1, props.challenge.hints.length))}
            disabled={showHint() >= props.challenge.hints.length}
          >
            <IconHint class="w-3 h-3" />
            <span class="label-mono">
              hint {showHint()}/{props.challenge.hints.length}
            </span>
          </button>
        </div>
        <Show when={showHint() > 0}>
          <div class="mt-2 space-y-1">
            <For each={props.challenge.hints.slice(0, showHint())}>
              {(h, i) => (
                <div class="text-[12px] text-ink-muted bg-bg-soft border-l-2 border-warn/60 px-3 py-1.5 rounded">
                  <span class="label-mono text-warn mr-1.5">#{i() + 1}</span>
                  {h}
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}
